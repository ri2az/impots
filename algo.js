let gain = 160000;
let impots = 0;
let final = 0;
let scale = {
  10064 : 0,
  25659 : 0.11,
  73369 : 0.3,
  157806 : 0.41,
  '+' : 0.45
}

let limit = Object.keys(scale);
let percentage = Object.values(scale);
let tranches = new Array(limit.length).fill(0);

let couple = false;
let enfants = 0;
let quotient = 1;

let calcQuotien = function () {

  if (couple) quotient ++;

  if (enfants > 0)
    if (enfants <= 2) 
      quotient = quotient + 0.5 * enfants;
    else 
      quotient = quotient + (enfants - 2) * 1 + 1; 
}

let calcTaxes = function(gain, parts, quotient){

  


  calc();

}

//calcQuotien();

//console.log(quotient)

//if (couple) gain = gain / quotient;

let calc = function (index = 1) {

  if (gain <= limit[0]) return 0

  if (index != limit.length - 1 && gain > limit[index]) {
    let pay = (limit[index] - limit[index-1]) * percentage[index];
    impots += Math.trunc(pay);
    tranches[index] = pay;
    return calc(index+1) 
  }
  else {
    let pay = (gain - limit[index-1]) * percentage[index];
    tranches[index] = pay;
    return impots += Math.trunc(pay);
  }
}

let calcInverse = function (final) {

  gain = final;

  let imp = gain - calc();

  console.log(imp);
  console.log(final);

  console.log(imp !== final);

  while(imp !== final){
    console.log('Gain test : ' + gain);
    console.log('Calc : ' + imp);
    gain ++;
    impots = 0;
    imp = gain - calc();
  }

  return gain;
}

let a = calcInverse(11000);

console.log('Resurt' + a);



/*
let result = calc();

//result = result * quotient;
final = gain - result;

console.log(tranches);
console.log(result);
console.log(final);

 */


/*
if (gain > limit[0]){

  if (gain > limit[1]) {
     impots =+ (limit[1] - limit[0]) * percentage[1];
    
     if (gain > limit[2]) {
       impots += (limit[2] - limit[1]) * percentage[2];

       if (gain > limit[3]) {
          impots += (limit[3] - limit[2]) * percentage[3];
       } 

       else {
         impots += (gain - limit[2]) * percentage[3];
       }
     }
     else {
       impots += (gain - limit[1]) * percentage[2];
     }
  }
  else{
       impots += (gain - limit[0]) * percentage[1];
  }
}

console.log(impots);
*/