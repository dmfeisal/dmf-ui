export function validateSlider({min,max,step,value}:{min:number;max:number;step:number|'any';value:number}){
 if(!Number.isFinite(min)||!Number.isFinite(max)||max<=min||!Number.isFinite(value)||value<min||value>max||(step!=='any'&&(!Number.isFinite(step)||step<=0)))throw new Error('Slider requires finite bounds, max > min, a value within bounds and a positive step or any.');
 if(step!=='any'&&Math.abs((value-min)/step-Math.round((value-min)/step))>1e-7)throw new Error('Slider initial value must match its step from min.');
}
