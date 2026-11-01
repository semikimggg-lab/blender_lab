import bpy, math
from mathutils import Vector

scene=bpy.context.scene
if bpy.context.screen.is_animation_playing:
    bpy.ops.screen.animation_cancel(restore_frame=False)
scene.frame_set(1)
bpy.context.view_layer.update()
originals=list(scene.objects)
materials={n:bpy.data.materials['ServoDemo '+n] for n in ['Graphite','Aluminum','Steel','Blue','Gold','White']}

def box(name,loc,size,mat,bevel=.003):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    o=bpy.context.object;o.name=name;o.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(materials[mat])
    if bevel:
        m=o.modifiers.new('Machined edges','BEVEL');m.width=bevel;m.segments=3
        o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    return o

def text(name,body,loc,size=.014):
    bpy.ops.object.text_add(location=loc,rotation=(math.pi/2,0,0))
    o=bpy.context.object;o.name=name;o.data.body=body;o.data.size=size;o.data.extrude=.0001
    o.data.materials.append(materials['White']);return o

# Pack body will carry the complete assembly's Geometry Nodes modifier.
pack=box('SERVO DRIVER | Select to configure',(-.51,.30,.205),(.20,.16,.38),'Graphite',.008)
bpy.context.view_layer.objects.active=pack
bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
box('Drive front panel',(-.51,.215,.205),(.17,.012,.33),'Aluminum')
box('Drive display glass',(-.51,.205,.287),(.14,.012,.09),'Graphite')
text('Drive label','SERVO DRIVE',(-.578,.196,.353),.018)
text('Drive display label','POSITION MODE',(-.574,.195,.305),.012)
text('Drive display hint','GN CONTROL',(-.574,.195,.278),.014)
text('Drive teaching label','VIRTUAL / TRAINING',(-.582,.196,.053),.011)
for i in range(3):
    box('Drive parameter key',(-.561+i*.05,.198,.196),(.033,.018,.025),'Blue')
for i in range(6):
    box('Drive cooling slot',(-.615,.265+i*.014,.23),(.006,.006,.21),'Steel',.001)
for i in range(2):
    box('Drive cable terminal',(-.56+i*.095,.205,.106),(.055,.027,.035),'Blue')

def cable(name,points,mat,radius):
    c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.bevel_depth=radius;c.bevel_resolution=4
    sp=c.splines.new('BEZIER');sp.bezier_points.add(len(points)-1)
    for p,co in zip(sp.bezier_points,points):p.co=co;p.handle_left_type='AUTO';p.handle_right_type='AUTO'
    o=bpy.data.objects.new(name,c);scene.collection.objects.link(o);o.data.materials.append(materials[mat])
cable('Motor power cable',[(-.56,.19,.105),(-.60,.05,.065),(-.55,-.04,.065),(-.38,-.015,.26),(-.35,0,.26)],'Graphite',.006)
cable('Encoder feedback cable',[(-.465,.19,.105),(-.47,.08,.055),(-.50,.02,.065),(-.45,0,.17)],'Blue',.004)

# Bake source meshes at the rest pose; hidden source objects remain editable backups.
sources=bpy.data.collections.new('GN Sources | Rest pose');scene.collection.children.link(sources)
groups={'Static':[], 'Rotor':[], 'Carriage':[], 'End support':[], 'Rails':[], 'Base':[]}
deps=bpy.context.evaluated_depsgraph_get()
for o in originals:
    if o.type not in {'MESH','CURVE','FONT'} or o.name=='Studio floor':continue
    if o.name in {'Screw shaft','Screw helical ridge'}:
        o.hide_render=True;o.hide_set(True);continue
    category='Static'
    if o.parent and o.parent.name=='Rotating drive':category='Rotor'
    elif o.parent and o.parent.name=='Linear carriage':category='Carriage'
    elif o.name in {'Bearing support.001','Bearing face.001'}:category='End support'
    elif o.name.startswith('Linear guide rail'):category='Rails'
    elif o.name=='Base plate':category='Base'
    mesh=bpy.data.meshes.new_from_object(o.evaluated_get(deps),depsgraph=deps)
    mesh.transform(o.matrix_world)
    source=bpy.data.objects.new('Source '+o.name,mesh);sources.objects.link(source)
    source.hide_render=True;source.hide_set(True);groups[category].append(source)
    o.hide_render=True;o.hide_set(True)

ng=bpy.data.node_groups.new('SEMI LAB | Servo Drive Parametric','GeometryNodeTree');ng.is_modifier=True
ng.interface.new_socket(name='Geometry',in_out='INPUT',socket_type='NodeSocketGeometry')
ng.interface.new_socket(name='Geometry',in_out='OUTPUT',socket_type='NodeSocketGeometry')
control=ng.interface.new_panel(name='Drive controls')
mechanical=ng.interface.new_panel(name='Mechanical setup')
socket_ids={}
for name,default,lo,hi,panel,description in [
    ('Target position (mm)',160,0,500,control,'Command from the home position; automatically limited to available travel.'),
    ('Speed limit (rpm)',120,1,1000,control,'Maximum commanded screw speed; short moves may not reach this speed.'),
    ('Accel / decel (s)',.8,.05,5,control,'Time to reach the speed limit; symmetric acceleration and deceleration.'),
    ('Screw length (mm)',560,400,800,mechanical,'Illustrative threaded section length; base, guides and end support follow.'),
    ('Lead (mm/rev)',20,5,40,mechanical,'Linear travel per screw revolution. Educational helical profile.')]:
    s=ng.interface.new_socket(name=name,in_out='INPUT',socket_type='NodeSocketFloat',parent=panel)
    s.default_value=default;s.min_value=lo;s.max_value=hi;s.description=description;socket_ids[name]=s.identifier
for name in ['Actual position (mm)','Screw angle (deg)','Actual speed (rpm)','Move duration (s)']:
    ng.interface.new_socket(name=name,in_out='OUTPUT',socket_type='NodeSocketFloat')
nodes=ng.nodes;links=ng.links
inp=nodes.new('NodeGroupInput');out=nodes.new('NodeGroupOutput');inp.location=(-1800,400);out.location=(1500,400)

def connect(value,socket):
    if isinstance(value,(int,float)):socket.default_value=value
    else:links.new(value,socket)
def calc(op,a,b=0,label=None):
    n=nodes.new('ShaderNodeMath');n.operation=op;n.label=label or op;connect(a,n.inputs[0]);connect(b,n.inputs[1]);return n.outputs[0]
def vec(x=0,y=0,z=0):
    n=nodes.new('ShaderNodeCombineXYZ')
    for value,s in zip((x,y,z),n.inputs):connect(value,s)
    return n.outputs[0]
def transform(geo,translation=None,rotation=None,scale=None):
    n=nodes.new('GeometryNodeTransform');links.new(geo,n.inputs['Geometry'])
    for name,val in [('Translation',translation),('Rotation',rotation),('Scale',scale)]:
        if val is not None:
            if isinstance(val,tuple):n.inputs[name].default_value=val
            else:links.new(val,n.inputs[name])
    return n.outputs['Geometry']
def join(geos):
    n=nodes.new('GeometryNodeJoinGeometry')
    for g in geos:links.new(g,n.inputs[0])
    return n.outputs[0]
def source_geo(name):
    geos=[]
    for o in groups[name]:
        n=nodes.new('GeometryNodeObjectInfo');n.transform_space='ORIGINAL';n.inputs['Object'].default_value=o;n.inputs['As Instance'].default_value=False;n.label=o.name;geos.append(n.outputs['Geometry'])
    return join(geos)
def material(geo,name):
    n=nodes.new('GeometryNodeSetMaterial');links.new(geo,n.inputs['Geometry']);n.inputs['Material'].default_value=materials[name];return n.outputs[0]

length=calc('MULTIPLY',inp.outputs['Screw length (mm)'],.001)
lead=calc('MULTIPLY',inp.outputs['Lead (mm/rev)'],.001)
distance=calc('MINIMUM',calc('MULTIPLY',inp.outputs['Target position (mm)'],.001),calc('SUBTRACT',length,.22),'Travel limit')
speed=calc('DIVIDE',calc('MULTIPLY',inp.outputs['Speed limit (rpm)'],lead),60)
acc=calc('DIVIDE',speed,inp.outputs['Accel / decel (s)'])
ramp=calc('MINIMUM',inp.outputs['Accel / decel (s)'],calc('SQRT',calc('DIVIDE',distance,acc)))
peak=calc('MULTIPLY',acc,ramp)
cruise=calc('MAXIMUM',calc('SUBTRACT',calc('DIVIDE',distance,calc('MAXIMUM',peak,.000001)),ramp),0)
duration=calc('ADD',calc('MULTIPLY',ramp,2),cruise)
clock=nodes.new('GeometryNodeInputSceneTime')
t=calc('MINIMUM',calc('MAXIMUM',calc('SUBTRACT',clock.outputs['Seconds'],1/scene.render.fps),0),duration)
ta=calc('MINIMUM',t,ramp)
td=calc('MINIMUM',calc('MAXIMUM',calc('SUBTRACT',t,calc('ADD',ramp,cruise)),0),ramp)
tc=calc('MINIMUM',calc('MAXIMUM',calc('SUBTRACT',t,ramp),0),cruise)
position=calc('ADD',calc('MULTIPLY',calc('MULTIPLY',acc,.5),calc('SUBTRACT',calc('MULTIPLY',ta,ta),calc('MULTIPLY',td,td))),calc('MULTIPLY',peak,calc('ADD',tc,td)),'Actual travel')
angle=calc('MULTIPLY',calc('DIVIDE',position,lead),math.tau)
velocity=calc('MULTIPLY',acc,calc('SUBTRACT',ta,td))

static=source_geo('Static')
rotor=transform(transform(source_geo('Rotor'),(0,0,-.145)),rotation=vec(angle,0,0))
rotor=transform(rotor,(0,0,.145))
carriage=transform(source_geo('Carriage'),vec(position,0,0))
support=transform(source_geo('End support'),vec(calc('SUBTRACT',length,.56),0,0))
rails=transform(transform(source_geo('Rails'),(.09,0,0)),scale=vec(calc('DIVIDE',calc('ADD',length,.08),.64),1,1))
rails=transform(rails,(-.09,0,0))
base=transform(transform(source_geo('Base'),(.33,0,0)),scale=vec(calc('DIVIDE',calc('ADD',length,.42),.98),1,1))
base=transform(base,(-.33,0,0))
cylinder=nodes.new('GeometryNodeMeshCylinder');cylinder.inputs['Vertices'].default_value=64;cylinder.inputs['Radius'].default_value=.013
links.new(calc('ADD',length,.08),cylinder.inputs['Depth'])
shaft=transform(cylinder.outputs['Mesh'],vec(calc('ADD',-.05,calc('MULTIPLY',length,.5)),0,.145),(0,math.pi/2,0))
shaft=material(shaft,'Steel')
spiral=nodes.new('GeometryNodeCurveSpiral');spiral.inputs['Resolution'].default_value=32;spiral.inputs['Reverse'].default_value=True
links.new(calc('DIVIDE',length,lead),spiral.inputs['Rotations']);links.new(length,spiral.inputs['Height'])
spiral.inputs['Start Radius'].default_value=.016;spiral.inputs['End Radius'].default_value=.016
circle=nodes.new('GeometryNodeCurvePrimitiveCircle');circle.inputs['Resolution'].default_value=8;circle.inputs['Radius'].default_value=.0025
tube=nodes.new('GeometryNodeCurveToMesh');links.new(spiral.outputs['Curve'],tube.inputs['Curve']);links.new(circle.outputs['Curve'],tube.inputs['Profile Curve'])
helix=transform(tube.outputs['Mesh'],rotation=(0,math.pi/2,0))
helix=transform(helix,rotation=vec(angle,0,0));helix=transform(helix,(-.05,0,.145));helix=material(helix,'Aluminum')
geometry=join([inp.outputs['Geometry'],static,rotor,carriage,support,rails,base,shaft,helix])
outputs={'Actual position (mm)':calc('MULTIPLY',position,1000),'Screw angle (deg)':calc('MULTIPLY',angle,180/math.pi),'Actual speed (rpm)':calc('MULTIPLY',calc('DIVIDE',velocity,lead),60),'Move duration (s)':duration}
for i,(name,value) in enumerate(outputs.items()):
    links.new(value,out.inputs[name])
    n=nodes.new('GeometryNodeStoreNamedAttribute');n.data_type='FLOAT';n.domain='POINT';n.inputs['Name'].default_value=['actual_position_mm','screw_angle_deg','actual_speed_rpm','move_duration_s'][i]
    links.new(geometry,n.inputs['Geometry']);links.new(value,n.inputs['Value']);geometry=n.outputs['Geometry']
links.new(geometry,out.inputs['Geometry'])
# Arrange readable functional columns; labels retain purpose for every branch.
counts={}
for n in nodes:
    if n in (inp,out):continue
    if n.bl_idname=='ShaderNodeMath':col=-1400
    elif n.bl_idname=='GeometryNodeObjectInfo':col=-1800
    elif n.bl_idname in {'GeometryNodeTransform','ShaderNodeCombineXYZ'}:col=-350
    elif n.bl_idname=='GeometryNodeStoreNamedAttribute':col=1050
    else:col=350
    row=counts.get(col,0);n.location=(col,150-row*160);counts[col]=row+1
modifier=pack.modifiers.new('Servo controls | Geometry Nodes','NODES');modifier.node_group=ng
pack['instructions']='Select this drive, open Modifiers. Edit Drive controls and Mechanical setup. Frame 1 is home; play timeline to execute. Outputs are node sockets and named geometry attributes.'
pack['scope']='Educational kinematics; no real driver communication, servo loop, torque or collision simulation.'
scene.frame_start=1;scene.frame_end=360;scene.frame_set(1)
scene.camera.location=(1.15,-1.65,1.2);scene.camera.rotation_euler=(Vector((-.02,.10,.15))-scene.camera.location).to_track_quat('-Z','Y').to_euler();scene.camera.data.ortho_scale=1.48
bpy.ops.object.select_all(action='DESELECT');pack.select_set(True);bpy.context.view_layer.objects.active=pack
for area in bpy.context.screen.areas:
    if area.type=='PROPERTIES':area.spaces.active.context='MODIFIER'
    if area.type=='VIEW_3D':area.spaces.active.region_3d.view_perspective='CAMERA'
bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath='/Users/semi/Documents/ChatGPT/Blender MCP 2/models/servo_driver_geometry_nodes.blend')
result={'file':bpy.data.filepath,'node_count':len(nodes),'input_identifiers':socket_ids,'host':pack.name,'outputs':list(outputs)}
