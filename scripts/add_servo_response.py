import bpy, math

scene=bpy.context.scene
if bpy.context.screen.is_animation_playing:bpy.ops.screen.animation_cancel(restore_frame=False)
scene.frame_set(1)
host=bpy.data.objects['SERVO DRIVER | Select to configure']
mod=host.modifiers['Servo controls | Geometry Nodes']
ng=mod.node_group
nodes=ng.nodes;links=ng.links
inp=next(n for n in nodes if n.bl_idname=='NodeGroupInput')
out=next(n for n in nodes if n.bl_idname=='NodeGroupOutput')
electronic=ng.interface.new_panel(name='Electronic gearing | pulse command')
gains=ng.interface.new_panel(name='Response gains | educational model')
noise=ng.interface.new_panel(name='Feedback disturbance | optional')
ids={}
for name,typ,value,low,high,panel,description in [
 ('Pulse command mode','NodeSocketBool',True,None,None,electronic,'Use pulse count instead of Target position (mm). No mechanical reduction is modeled.'),
 ('Command pulses','NodeSocketInt',160000,0,2000000,electronic,'Total reference pulse count; the existing speed and acceleration settings profile the move.'),
 ('Electronic numerator','NodeSocketInt',1048576,1,16777216,electronic,'Encoder counts per command pulse = numerator / denominator.'),
 ('Electronic denominator','NodeSocketInt',20000,1,16777216,electronic,'Positive denominator of electronic gearing.'),
 ('Encoder counts / rev','NodeSocketInt',1048576,1000,16777216,electronic,'Illustrative encoder resolution; not a hardware recommendation.'),
 ('Position gain Kp (demo)','NodeSocketFloat',20,1,80,gains,'Outer position gain in this simplified normalized model.'),
 ('Velocity gain Kv (demo)','NodeSocketFloat',80,.2,160,gains,'Inner velocity correction. Low Kv relative to Kp produces underdamped response.'),
 ('Feedback ripple (um)','NodeSocketFloat',0,0,2000,noise,'Optional sinusoidal measurement disturbance; zero disables it. This is not an automatic consequence of gain.'),
 ('Ripple frequency (Hz)','NodeSocketFloat',4,.2,30,noise,'Frequency of the optional measurement ripple.')]:
 s=ng.interface.new_socket(name=name,in_out='INPUT',socket_type=typ,parent=panel);s.default_value=value;s.description=description
 if low is not None:s.min_value=low;s.max_value=high
 ids[name]=s.identifier

def connect(v,s):
 if isinstance(v,(int,float)):s.default_value=v
 else:links.new(v,s)
def calc(op,a,b=0,label=''):
 n=nodes.new('ShaderNodeMath');n.operation=op;n.label=label or op;connect(a,n.inputs[0]);connect(b,n.inputs[1]);return n.outputs[0]
def vec(x=0,y=0,z=0):
 n=nodes.new('ShaderNodeCombineXYZ')
 for v,s in zip((x,y,z),n.inputs):connect(v,s)
 return n.outputs[0]

lead=calc('MULTIPLY',inp.outputs['Lead (mm/rev)'],.001)
ratio=calc('DIVIDE',inp.outputs['Electronic numerator'],calc('MAXIMUM',inp.outputs['Electronic denominator'],1))
counts=calc('MAXIMUM',inp.outputs['Encoder counts / rev'],1)
per_pulse=calc('DIVIDE',calc('MULTIPLY',ratio,lead),counts)
pulse_distance=calc('MULTIPLY',inp.outputs['Command pulses'],per_pulse)
switch=nodes.new('GeometryNodeSwitch');switch.input_type='FLOAT'
links.new(inp.outputs['Pulse command mode'],switch.inputs['Switch'])
links.new(calc('MULTIPLY',inp.outputs['Target position (mm)'],.001),switch.inputs['False']);links.new(pulse_distance,switch.inputs['True'])
limit=next(n for n in nodes if n.label=='Travel limit');links.new(switch.outputs[0],limit.inputs[0])
distance=limit.outputs[0]
max_travel=calc('SUBTRACT',calc('MULTIPLY',inp.outputs['Screw length (mm)'],.001),.22)
command=next(n for n in nodes if n.label=='Actual travel');command.label='Command travel';command_socket=command.outputs[0]
old_consumers=[l.to_socket for l in list(command_socket.links)]
speed=calc('DIVIDE',calc('MULTIPLY',inp.outputs['Speed limit (rpm)'],lead),60)
acc=calc('DIVIDE',speed,inp.outputs['Accel / decel (s)'])
ramp=calc('MINIMUM',inp.outputs['Accel / decel (s)'],calc('SQRT',calc('DIVIDE',distance,acc)))
peak=calc('MULTIPLY',acc,ramp)
cruise=calc('MAXIMUM',calc('SUBTRACT',calc('DIVIDE',distance,calc('MAXIMUM',peak,.000001)),ramp),0)
clock=nodes.new('GeometryNodeInputSceneTime')
raw_time=calc('MAXIMUM',calc('SUBTRACT',clock.outputs['Seconds'],1/scene.render.fps),0)
time=calc('MINIMUM',raw_time,60,'60 second teaching preview horizon')
steps=calc('CEIL',calc('MULTIPLY',time,240))
dt=calc('DIVIDE',time,calc('MAXIMUM',steps,1))

ri=nodes.new('GeometryNodeRepeatInput');ro=nodes.new('GeometryNodeRepeatOutput');ri.pair_with_output(ro)
ro.repeat_items.new('FLOAT','Position');ro.repeat_items.new('FLOAT','Velocity')
ri.label='Integrate from home at 240 Hz';ro.label='Closed loop response'
links.new(steps,ri.inputs['Iterations'])
st=calc('MULTIPLY',calc('ADD',ri.outputs['Iteration'],1),dt)
ta=calc('MINIMUM',st,ramp)
td=calc('MINIMUM',calc('MAXIMUM',calc('SUBTRACT',st,calc('ADD',ramp,cruise)),0),ramp)
tc=calc('MINIMUM',calc('MAXIMUM',calc('SUBTRACT',st,ramp),0),cruise)
ref=calc('ADD',calc('MULTIPLY',calc('MULTIPLY',acc,.5),calc('SUBTRACT',calc('MULTIPLY',ta,ta),calc('MULTIPLY',td,td))),calc('MULTIPLY',peak,calc('ADD',tc,td)))
ripple=calc('MULTIPLY',calc('MULTIPLY',inp.outputs['Feedback ripple (um)'],.000001),calc('SINE',calc('MULTIPLY',calc('MULTIPLY',st,inp.outputs['Ripple frequency (Hz)']),math.tau)))
error=calc('SUBTRACT',ref,calc('ADD',ri.outputs['Position'],ripple))
desired_v=calc('MULTIPLY',inp.outputs['Position gain Kp (demo)'],error)
accel=calc('MULTIPLY',inp.outputs['Velocity gain Kv (demo)'],calc('SUBTRACT',desired_v,ri.outputs['Velocity']))
accel=calc('MINIMUM',calc('MAXIMUM',accel,-5),5,'Normalized actuator acceleration saturation')
v=calc('ADD',ri.outputs['Velocity'],calc('MULTIPLY',accel,dt))
free_x=calc('ADD',ri.outputs['Position'],calc('MULTIPLY',v,dt))
x=calc('MINIMUM',calc('MAXIMUM',free_x,0),max_travel,'Teaching travel stop')
inside=calc('MULTIPLY',calc('GREATER_THAN',free_x,0),calc('LESS_THAN',free_x,max_travel))
links.new(x,ro.inputs['Position']);links.new(calc('MULTIPLY',v,inside),ro.inputs['Velocity'])
actual=ro.outputs['Position'];actual_v=ro.outputs['Velocity']
for socket in old_consumers:links.new(actual,socket)
old_rpm=out.inputs['Actual speed (rpm)'].links[0].from_socket
rpm_consumers=[l.to_socket for l in list(old_rpm.links)]
actual_rpm=calc('MULTIPLY',calc('DIVIDE',actual_v,lead),60)
for socket in rpm_consumers:links.new(actual_rpm,socket)

# Orange pointer follows the command; the blue carriage follows the simulated motor.
marker=nodes.new('GeometryNodeMeshCube');marker.inputs['Size'].default_value=(.006,.018,.07)
move=nodes.new('GeometryNodeTransform');links.new(marker.outputs['Mesh'],move.inputs['Geometry'])
links.new(vec(calc('ADD',.12,command_socket),-.145,.075),move.inputs['Translation'])
mat=nodes.new('GeometryNodeSetMaterial');mat.inputs['Material'].default_value=bpy.data.materials['ServoDemo Gold'];links.new(move.outputs['Geometry'],mat.inputs['Geometry'])
existing_geo=out.inputs['Geometry'].links[0].from_socket
join=nodes.new('GeometryNodeJoinGeometry');links.new(existing_geo,join.inputs[0]);links.new(mat.outputs[0],join.inputs[0]);geometry=join.outputs[0]
extra={
 'Command position (mm)':(calc('MULTIPLY',command_socket,1000),'command_position_mm'),
 'Following error (mm)':(calc('MULTIPLY',calc('SUBTRACT',command_socket,actual),1000),'following_error_mm'),
 'Travel per pulse (mm)':(calc('MULTIPLY',per_pulse,1000),'travel_per_pulse_mm'),
 'Damping ratio (demo)':(calc('MULTIPLY',calc('SQRT',calc('DIVIDE',inp.outputs['Velocity gain Kv (demo)'],inp.outputs['Position gain Kp (demo)'])),.5),'damping_ratio_demo'),
 'Requested target (mm)':(calc('MULTIPLY',switch.outputs[0],1000),'requested_target_mm')}
for name,(value,attr) in extra.items():
 ng.interface.new_socket(name=name,in_out='OUTPUT',socket_type='NodeSocketFloat');links.new(value,out.inputs[name])
 store=nodes.new('GeometryNodeStoreNamedAttribute');store.data_type='FLOAT';store.domain='POINT';store.inputs['Name'].default_value=attr
 links.new(geometry,store.inputs['Geometry']);links.new(value,store.inputs['Value']);geometry=store.outputs[0]
links.new(geometry,out.inputs['Geometry'])
# Reapply actual values after adding the command marker so every point reports the same telemetry.
for name,attr in [('Actual position (mm)','actual_position_mm'),('Screw angle (deg)','screw_angle_deg'),('Actual speed (rpm)','actual_speed_rpm'),('Move duration (s)','move_duration_s')]:
 value=out.inputs[name].links[0].from_socket
 store=nodes.new('GeometryNodeStoreNamedAttribute');store.data_type='FLOAT';store.domain='POINT';store.inputs['Name'].default_value=attr
 links.new(geometry,store.inputs['Geometry']);links.new(value,store.inputs['Value']);geometry=store.outputs[0]
links.new(geometry,out.inputs['Geometry'])
depths={}
def depth(n,seen=None):
 if n.name in depths:return depths[n.name]
 seen=set() if seen is None else seen
 if n.name in seen:return 0
 seen.add(n.name);parents=[l.from_node for s in n.inputs for l in s.links]
 d=1+max((depth(p,seen.copy()) for p in parents),default=-1);depths[n.name]=d;return d
rows={}
for n in nodes:
 col=depth(n);row=rows.get(col,0);n.location=(col*230,-row*180);n.width=190;rows[col]=row+1
host['response_model']='Normalized cascaded P position / P velocity loop; semi-implicit Euler 240 Hz, acceleration saturated at +/-5 m/s^2, travel stops, 60 second preview horizon. Not a hardware tuning model.'
host['electronic_gearing']='distance = pulses * numerator / denominator / encoder_counts_per_rev * screw_lead; direct mechanical coupling 1:1.'
host['presets']='Stable Kp=20 Kv=80 ripple=0; ringing Kp=80 Kv=0.4 ripple=0; forced hunting Kp=80 Kv=8 ripple=1000um frequency=4Hz. Illustrative values only.'
bpy.data.objects['Drive display label'].data.body='E-GEAR / GAIN'
bpy.data.objects['Drive display hint'].data.body='VIRTUAL SERVO'
for item in ng.interface.items_tree:
 if item.item_type=='SOCKET' and item.in_out=='INPUT' and item.identifier in ids.values():
  getattr(mod.properties.inputs,item.identifier).value=item.default_value
scene.frame_end=360;scene.frame_set(1);host.update_tag();bpy.context.view_layer.update()
bpy.ops.object.select_all(action='DESELECT');host.select_set(True);bpy.context.view_layer.objects.active=host
bpy.ops.wm.save_as_mainfile(filepath='/Users/semi/Documents/ChatGPT/Blender MCP 2/models/servo_egear_gain_response.blend')
result={'file':bpy.data.filepath,'inputs':ids,'nodes':len(nodes)}
