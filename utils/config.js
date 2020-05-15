//发版须修改version, env
const env = {
    dev: {
        PHP: 'https://fobll.cn/tp/index.php',
        IMG: 'http://47.100.17.14/img/',
        PYTHON: 'http://192.168.8.109:5000/'
    },
    test: {
        PHP: 'https://fobll.cn/tp/index.php',
        IMG: 'http://47.100.17.14/img/',
        PYTHON: 'http://47.100.17.14:5000/fobll-api/'
    },
    pro: {
        PHP: 'https://fobll.cn/tp/index.php',
        IMG: 'http://47.100.17.14/img/',
        PYTHON: 'https://fobll.cn/fobll-api/'
    }
}
module.exports = {
    // ...env.dev
    // ...env.test
    ...env.pro
}