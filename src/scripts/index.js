import vConsole from 'vconsole';
import eruda from 'eruda';

if (process.env.NODE_ENV != 'production') {
    let s = document.createElement('script')
    s.setAttribute('inspect-type', 'vConsole')
    document.body.append(s)
}

let el = document.querySelector('script[inspect-type]')
if (el) {
    el.innerHTML = '/****/'
    let destroy = () => { }
    let preType = ''
    /**
     * 监听dom节点变化
     */
    let observe = new MutationObserver(function ([e]) {
        if (e.type == 'attributes' && e.attributeName == 'inspect-type' && e.target == el) {
            setConsolePanel()
        } else if (e.type == 'childList' && Array.from(e.removedNodes).includes(el)) {
            setConsolePanel()
        }
    })
    observe.observe(el, { attributes: true });// 监听属性值变化
    observe.observe(el.parentElement, { childList: true });// 监听是否被删除

    // 重新设置面板
    function setConsolePanel() {
        let cur = el.getAttribute('inspect-type');
        if (!el.parentElement) cur = ''
        if (cur == 'vConsole' && cur != preType) {
            destroy()
            let v = new vConsole()
            destroy = () => v.destroy()
        } else if (cur == 'eruda' && cur != preType) {
            destroy()
            eruda.init()
            destroy = () => eruda.destroy()
        } else {
            destroy()
            observe.disconnect()
            el.remove()
        }
        preType = cur
    }
    
    setConsolePanel()
}