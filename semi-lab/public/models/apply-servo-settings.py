"""Run in Blender's Text Editor, then select the JSON exported by SEMI LAB.
Applies validated parameters to the existing servo node group without saving the file.
"""
import bpy, json, math
from bpy_extras.io_utils import ImportHelper

FIELDS = {
 'pulseMode': ('Socket_16',None,None), 'pulses': ('Socket_17',0,2000000),
 'numerator': ('Socket_18',1,16777216), 'denominator': ('Socket_19',1,16777216),
 'encoder': ('Socket_20',1000,16777216), 'target': ('Socket_4',0,500),
 'rpm': ('Socket_5',1,1000), 'accel': ('Socket_6',.05,5),
 'length': ('Socket_7',400,800), 'lead': ('Socket_8',5,40),
 'kp': ('Socket_21',1,80), 'kv': ('Socket_22',.2,160),
 'ripple': ('Socket_23',0,2000), 'frequency': ('Socket_24',.2,30)
}

def apply_settings(path):
    with open(path,encoding='utf-8') as f:
        raw=f.read(32769)
    if len(raw)>32768: raise ValueError('Settings file too large')
    data=json.loads(raw)
    if data.get('schema')!='semi-lab-servo-v1': raise ValueError('Unsupported settings schema')
    values=data.get('parameters',{})
    if set(values)!=set(FIELDS): raise ValueError('Unexpected or missing parameter')
    for key,(_,lo,hi) in FIELDS.items():
        value=values[key]
        if key=='pulseMode':
            if type(value) is not bool: raise ValueError('pulseMode must be boolean')
        elif type(value) not in (int,float) or not math.isfinite(value) or not lo<=value<=hi:
            raise ValueError('Invalid parameter: '+key)
        if key in ('pulses','numerator','denominator','encoder') and int(value)!=value:
            raise ValueError('Integer required: '+key)
    obj=bpy.data.objects.get('SERVO DRIVER | Select to configure')
    if not obj: raise ValueError('Open servo_egear_gain_response.blend first')
    modifier=next((m for m in obj.modifiers if m.type=='NODES' and m.node_group and m.node_group.name=='SEMI LAB | Servo Drive Parametric'),None)
    if modifier is None: raise ValueError('Servo Geometry Nodes modifier not found')
    interface=modifier.properties.inputs
    for key,(socket,_,_) in FIELDS.items():
        if not hasattr(interface,socket): raise ValueError('Incompatible node-group version')
    for key,(socket,_,_) in FIELDS.items(): getattr(interface,socket).value=values[key]
    bpy.context.scene.frame_set(1);obj.update_tag();bpy.context.view_layer.update()
    return obj

class SEMILAB_OT_import_servo_settings(bpy.types.Operator,ImportHelper):
    bl_idname='semilab.import_servo_settings'
    bl_label='Import SEMI LAB Servo Settings'
    bl_options={'REGISTER','UNDO'}
    filename_ext='.json'
    filter_glob:bpy.props.StringProperty(default='*.json',options={'HIDDEN'})
    def execute(self,context):
        try:apply_settings(self.filepath)
        except (ValueError,OSError,TypeError) as e:
            self.report({'ERROR'},str(e));return {'CANCELLED'}
        self.report({'INFO'},'Servo parameters applied. File has not been saved.')
        return {'FINISHED'}

if __name__=='__main__':
    previous=getattr(bpy.types,'SEMILAB_OT_import_servo_settings',None)
    if previous:bpy.utils.unregister_class(previous)
    bpy.utils.register_class(SEMILAB_OT_import_servo_settings)
    bpy.ops.semilab.import_servo_settings('INVOKE_DEFAULT')
