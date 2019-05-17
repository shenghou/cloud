// ========== 分割线 =============
process.nextTick(function(){
    console.log('延迟执行');
})
console.log('正常执行');


// ========== 分割线 =============
setImmediate(function(){
    console.log('延迟执行');
})
console.log('正常执行');


// ========== 分割线 =============
process.nextTick(function(){
    console.log('延迟执行1');
})
setImmediate(function(){
    console.log('延迟执行2');
})
console.log('正常执行');

// ========== 分割线 =============
setImmediate(function(){
    console.log('延迟执行1');
    process.nextTick(function(){
        console.log('插入1');
    })
})
setImmediate(function(){
    console.log('延迟执行2');
})