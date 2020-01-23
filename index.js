module.exports = { 
    NativeVlElement: require('./vl-core.src.js').NativeVlElement,
    VlElement: require('./vl-core.src.js').VlElement,
    define: require('./vl-core.src.js').define, 
    awaitScript: require('./vl-core.src.js').awaitScript, 
    awaitUntil: require('./vl-core.src.js').awaitUntil,
    Test: {
        VlElement: require('./test/e2e/components/vl-element'), 
        Page: require('./test/e2e/pages/page'), 
        Config: require('./test/e2e/config'), 
        Setup: require('./test/e2e/setup'),
        Cookie: require('./test/e2e/components/cookie')
    }
}