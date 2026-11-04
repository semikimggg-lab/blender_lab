// Exporters can include clips whose keyframes all contain the same pose.
// Treat quaternion sign flips (q and -q) as the same orientation.
export function clipHasMotion(clip){
 return clip.tracks.some(track=>{
  const size=track.getValueSize(),values=track.values;
  if(track.times.length<2||values.length<size*2)return false;
  const cubic=track.createInterpolant?.isInterpolantFactoryMethodGLTFCubicSpline;
  const stride=size,components=cubic?size/3:size,offset=cubic?components:0;
  for(let frame=1;frame<track.times.length;frame++){
   let difference=0,opposite=0;
   for(let axis=0;axis<components;axis++){
    const first=values[offset+axis],value=values[frame*stride+offset+axis];
    difference=Math.max(difference,Math.abs(value-first));opposite=Math.max(opposite,Math.abs(value+first));
   }
   if(track.name.endsWith('.quaternion')&&components===4){if(Math.min(difference,opposite)>1e-5)return true;}
   else if(difference>1e-5)return true;
  }
  // Nonzero cubic tangents can move a value even when its endpoints match.
  if(cubic)for(let frame=0;frame<track.times.length;frame++)for(let axis=0;axis<components;axis++)if(Math.abs(values[frame*stride+axis])>1e-5||Math.abs(values[frame*stride+2*components+axis])>1e-5)return true;
  return false;
 });
}
export function animationChoices(clips){const moving=clips.map(clipHasMotion);return {moving,defaultIndex:Math.max(0,moving.indexOf(true))};}
