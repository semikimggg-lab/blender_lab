export const defaults = Object.freeze({pulseMode:true,pulses:160000,numerator:1048576,denominator:20000,encoder:1048576,target:160,rpm:120,accel:.8,length:560,lead:20,kp:20,kv:80,ripple:0,frequency:4});
export const limits={pulses:[0,2000000],numerator:[1,16777216],denominator:[1,16777216],encoder:[1000,16777216],target:[0,500],rpm:[1,1000],accel:[.05,5],length:[400,800],lead:[5,40],kp:[1,80],kv:[.2,160],ripple:[0,2000],frequency:[.2,30]};
export const sockets={pulseMode:'Socket_16',pulses:'Socket_17',numerator:'Socket_18',denominator:'Socket_19',encoder:'Socket_20',target:'Socket_4',rpm:'Socket_5',accel:'Socket_6',length:'Socket_7',lead:'Socket_8',kp:'Socket_21',kv:'Socket_22',ripple:'Socket_23',frequency:'Socket_24'};
const clamp=(v,a,b)=>Math.max(a,Math.min(v,b));
export function validate(p){
 const v={...defaults,...p};if(typeof v.pulseMode!=='boolean')throw new Error('pulseMode');
 for(const [k,[lo,hi]] of Object.entries(limits)){if(!Number.isFinite(v[k])||v[k]<lo||v[k]>hi)throw new Error(k);}
 for(const k of ['pulses','numerator','denominator','encoder'])if(!Number.isInteger(v[k]))throw new Error(k);
 return v;
}
export function profile(input){
 const p=validate(input),lead=p.lead*.001,maxTravel=p.length*.001-.22,perPulse=p.numerator/p.denominator/p.encoder*p.lead;
 const requested=p.pulseMode?p.pulses*perPulse:p.target,distance=Math.min(requested*.001,maxTravel),speed=p.rpm*lead/60,a=speed/p.accel;
 const ramp=Math.min(p.accel,Math.sqrt(distance/a)),peak=a*ramp,cruise=Math.max(distance/Math.max(peak,.000001)-ramp,0),duration=2*ramp+cruise;
 return {p,lead,maxTravel,perPulse,requested,distance,speed,a,ramp,peak,cruise,duration,damping:.5*Math.sqrt(p.kv/p.kp)};
}
export function commandAt(t,q){const ta=Math.min(t,q.ramp),td=clamp(t-q.ramp-q.cruise,0,q.ramp),tc=clamp(t-q.ramp,0,q.cruise);return .5*q.a*(ta*ta-td*td)+q.peak*(tc+td);}
export function simulate(input,horizon=12){
 const q=profile(input),dt=1/240,steps=Math.round(Math.min(60,horizon)*240),data=[];let x=0,v=0;
 data.push({t:0,x:0,v:0,command:0,error:0,angle:0,rpm:0});
 for(let i=1;i<=steps;i++){
  const t=i*dt,command=commandAt(t,q),ripple=q.p.ripple*1e-6*Math.sin(t*q.p.frequency*2*Math.PI);
  const acceleration=clamp(q.p.kv*(q.p.kp*(command-x-ripple)-v),-5,5);
  v+=acceleration*dt;const free=x+v*dt;x=clamp(free,0,q.maxTravel);if(free<=0||free>=q.maxTravel)v=0;
  data.push({t,x,v,command,error:command-x,angle:x/q.lead*2*Math.PI,rpm:v/q.lead*60});
 }
 return {...q,data,horizon:steps*dt};
}
export function atTime(run,time){const i=clamp(Math.round(time*240),0,run.data.length-1);return run.data[i];}
