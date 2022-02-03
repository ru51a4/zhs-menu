class zhsmenu {
    menu = {};

    constructor(menu) {
        this.menu = menu;
    }

    init(selector) {
        let menu = this.menu;
        let c = 0;
        let maxLvl = 0;
        let getMaxLvl = (item) => {
            item.childrens.forEach((cItem) => {
                c++
                if (maxLvl < c) {
                    maxLvl = c;
                }
                getMaxLvl(cItem);
                c--;
            })
        };
        getMaxLvl(menu);
        let getParrent = (node, prev) => {
            node.parrent = prev?.title;
            node.childrens.forEach((item) => {
                getParrent(item, node);
            })
        };
        getParrent(menu);

        let html = `<div class="zhs-menu">
                <div class="zhs-menu--items">`;
        let t = [];
        let cLvl = 1;
        let queue = [...menu.childrens];
        while (queue.length) {
            let item = queue.shift();
            let displaynone = (cLvl > 1) ? 'display:none' : ''
            let next = (item.childrens.length) ? "->" : "";
            html += `
                <div lvl="${cLvl}" data="${item.title}" parrent="${item.parrent}" style="${displaynone}" class="zhs-menu--items--item">
                    ${item.title}
                    ${next}
                </div>`;
            t.push(...item.childrens);
            if (!queue.length) {
                queue.push(...t);
                html += `</div>`;
                if (t.length) {
                    html += `<div class="zhs-menu--items">`;
                }
                t = [];
                cLvl++
            }
        }
        html += "</div>"
        document.querySelector(selector).innerHTML = html;
        document.querySelectorAll(".zhs-menu--items--item").forEach((el) => {
            el.addEventListener("click", (item) => {
                let data = el.getAttribute("data");
                let lvl = document.querySelectorAll(`[parrent="${data}"]`)[0].getAttribute("lvl");
                for (let i = parseInt(lvl); i <= maxLvl; i++) {
                    document.querySelectorAll(`[lvl="${i}"]`).forEach((el) => {
                        el.style.display = "none";
                    });
                }
                document.querySelectorAll(`[parrent="${data}"]`).forEach((el) => {
                    el.style.display = "inline";
                })
            });
        })
    }
}