import {verifyUser, loginUser} from './common.js'

(async () => {

    const metamaskWarning = document.getElementById("metamaskWarning");

    const contract = await new Promise((accept, reject) => {

        window.addEventListener('load', async () => {

            const accessContract = async (web3) => {
                window.web3 = web3;
                const ress = await Promise.all([
                    fetch('abi.json'),
                    fetch('address.json'),
                ]);
                const [jsonInterface, address] = await Promise.all(ress.map(res => res.json()));
                return web3.eth.contract(jsonInterface).at(address);
            }

            let contract = null;

            // Modern dapp browsers...
            if (window.ethereum) {
                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                    contract = await accessContract(new window.top.Web3(ethereum))

                } catch (error) {
                    metamaskWarning.style.display = "block";
                    console.warn("User denied access to Metamask account.")
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                contract = await accessContract(new window.Web3(window.web3.currentProvider))
            }
            // Non-dapp browsers...
            else {
                metamaskWarning.style.display = "block";
                console.warn("Non-Ethereum browser detected. You should consider trying MetaMask!")
            }
            if (contract) {
                accept(contract)
            }
            else {
                reject(new Error("No contract"))
            }
        });
    });

    const res = await fetch(`https://content.exokit.org/users/avaer`);
    const root = await res.json();

    const files = [];
    const hashes = [];
    let keypath = '';
    const _recurse = node => {
        keypath += (keypath ? '/' : '') + node.name;

        if (node.hash) {
            files.push(keypath);
            hashes.push('0x' + node.hash);
        }
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                _recurse(node.children[i]);
            }
        }
    };
    _recurse(root);
    const ids = await Promise.all(hashes.map(hash => new Promise((accept, reject) => {
        // const hash = '0x' + filename.match(/([^\/]*)$/)[1];
        contract.getId(hash, (err, id) => {
            if (!err) {
                accept(id.toNumber());
            } else {
                reject(err);
            }
        });
    })));

    // Define links for popout-nav
    const navLinks = [
        {
            url: "https://store.exokit.org/",
            title: "Store",
            active: window.location.host.split(".")[0] === "store"
        },
        {
            url: "https://avatars.exokit.org/",
            title: "Avatars",
            active: window.location.host.split(".")[0] === "avatars"
        },
        {
            url: "https://multiplayer.exokit.org/",
            title: "Multiplayer",
            active: window.location.host.split(".")[0] === "multiplayer"
        },
        {
            url: "https://editor.exokit.org/",
            title: "Editor",
            active: window.location.host.split(".")[0] === "editor"
        },
        {
            url: "https://exokit.org/",
            title: "Home",
            active: window.location.host.split(".")[0] === "exokit"
        }
    ]

    // Populate nav-popout with links
    document.getElementById('nav-popout').innerHTML = navLinks.map((link, index) => {
        return `
        <div>
          <a href=${link.url} class=${link.active ? "activeNav" : ""}>${link.title}</a>
        </div>
      `
    }).join(`<br/>`)

    // Close nav-popout if user clicks away
    document.getElementById("nav-popout").addEventListener("blur", (e) => {
        const navPopout = document.getElementById('nav-popout');
        // wait for <a> to fire
        setTimeout(() => {
            navPopout.style.display = "none"
        }, 100)
    })

    // Handle logo click, open nav-popout
    document.getElementById("logo").addEventListener("click", (e) => {
        const navPopout = document.getElementById('nav-popout');
        if (document.activeElement === navPopout) {
            navPopout.blur()
        }
        else {
            navPopout.style.display = "block";
            navPopout.focus()
        }
    })

    document.getElementById("logo").addEventListener("mousedown", (e) => {
        e.preventDefault()
    })

    // Populate cardContainer with cards
    document.getElementById('cardContainer').innerHTML = files.map((file, i) => {
        const rawHash = hashes[i].slice(2);
        const id = ids[i];
        return `
        <div class="app-card">
          <img src="https://content.exokit.org/preview/${rawHash}" height=100>
          <div class="cardLink">
            <a href="https://viewer.exokit.org/${rawHash}">${file}</a>
          </div>
          <div class="openSeaBtn">
            <a href="https://rinkeby.opensea.io/assets/${contract.address}/${id}" class="button first last external-link-button">OpenSea</a>
          </div>
        </div>
      `
    }).join('\n');

})();