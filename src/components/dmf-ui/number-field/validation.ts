export function validateNumberField({min,max,step,value}:{min?:number;max?:number;step:number;value?:number}){
 if([min,max,value].some(item=>item!==undefined&&!Number.isFinite(item))||!Number.isFinite(step)||step<=0)throw new Error('NumberField requires finite bounds/value and a positive numeric step.');
 if(min!==undefined&&max!==undefined&&min>max)throw new Error('NumberField min must not exceed max.');
 if(value!==undefined&&((min!==undefined&&value<min)||(max!==undefined&&value>max)))throw new Error('NumberField initial value must be within its bounds.');
 const base=min??value??0;
 if(value!==undefined&&Math.abs((value-base)/step-Math.round((value-base)/step))>1e-7)throw new Error('NumberField initial value must match its native step grid.');
}
