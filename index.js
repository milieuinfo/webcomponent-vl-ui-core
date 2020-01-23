const { NativeVlElement, VlElement, define, awaitScript, awaitUntil } = require('./vl-core.src.js');

module.exports = { 
    NativeVlElement, 
    VlElement, 
    define, 
    awaitScript, 
    awaitUntil,
    Test: {
        VlElement: require('./test/e2e/components/vl-element'), 
        Page: require('./test/e2e/pages/page'), 
        Config: require('./test/e2e/config'), 
        Setup: require('./test/e2e/setup'),
        Cookie: require('./test/e2e/components/cookie')
    }
}