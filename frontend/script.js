// ============================================================
// VEHICLECHAIN - VEHICLE HISTORY DAPP
// ============================================================

let provider;
let signer;
let contract;

let currentAccount = null;


// ============================================================
// CONTRACT CONFIGURATION
// ============================================================

// IMPORTANT:
// Replace this after deploying VehicleHistory.sol to Sepolia.

const CONTRACT_ADDRESS =
    "0xaA6199115FC58Dec5661373Fb779a3b4650Cb8aa";


// ============================================================
// CONTRACT ABI
// ============================================================

const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "vehicleId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "addServiceRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "serviceCenter",
        "type": "address"
      }
    ],
    "name": "authorizeServiceCenter",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "vehicleId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "registrationNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "model",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "manufacturer",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "registerVehicle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "vehicleId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "vehicleId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "serviceCenter",
        "type": "address"
      }
    ],
    "name": "ServiceCenterAuthorized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "vehicleId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "serviceDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "serviceCenter",
        "type": "address"
      }
    ],
    "name": "ServiceRecordAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "vehicleId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "registrationNumber",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "VehicleRegistered",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "authorizedServiceCenters",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "vehicleId",
        "type": "string"
      }
    ],
    "name": "getOwnershipHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "transferredAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct VehicleHistory.OwnershipRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "vehicleId",
        "type": "string"
      }
    ],
    "name": "getServiceHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "serviceDate",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "serviceCenter",
            "type": "address"
          }
        ],
        "internalType": "struct VehicleHistory.ServiceRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "vehicleId",
        "type": "string"
      }
    ],
    "name": "getVehicleDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "vehicleId",
        "type": "string"
      }
    ],
    "name": "vehicleExistsCheck",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// ============================================================
// DOM ELEMENTS
// ============================================================

const connectWalletBtn =
    document.getElementById("connectWalletBtn");

const networkStatus =
    document.getElementById("networkStatus");

const networkName =
    document.getElementById("networkName");

const walletCard =
    document.getElementById("walletCard");

const walletAddress =
    document.getElementById("walletAddress");

const walletRole =
    document.getElementById("walletRole");

const notification =
    document.getElementById("notification");

const notificationText =
    document.getElementById("notificationText");


// ============================================================
// NOTIFICATIONS
// ============================================================

function showNotification(message, type = "success") {

    notificationText.textContent = message;

    notification.className =
        `notification ${type}`;

    notification.style.display = "block";

    setTimeout(() => {

        notification.style.display = "none";

    }, 5000);
}


// ============================================================
// WALLET CONNECTION
// ============================================================

async function connectWallet() {

    try {

        if (!window.ethereum) {

            showNotification(
                "MetaMask is not installed.",
                "error"
            );

            return;
        }


        // Request wallet access

        await window.ethereum.request({
            method: "eth_requestAccounts"
        });


        // Ethers provider

        provider =
            new ethers.BrowserProvider(
                window.ethereum
            );


        signer =
            await provider.getSigner();


        currentAccount =
            await signer.getAddress();


        // Network

        const network =
            await provider.getNetwork();


        const chainId =
            Number(network.chainId);


        console.log(
            "Connected network:",
            network.name,
            chainId
        );


        // Contract

        contract =
            new ethers.Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );


        // UI

        walletCard.classList.remove("hidden");

        walletAddress.textContent =
            shortenAddress(currentAccount);

        networkStatus.textContent =
            "Connected";

        networkName.textContent =
            getNetworkName(chainId);


        connectWalletBtn.textContent =
            "Wallet Connected";


        // Load role

        await loadWalletRole();


        showNotification(
            "Wallet connected successfully."
        );


    } catch (error) {

        console.error(error);

        showNotification(
            getErrorMessage(error),
            "error"
        );
    }
}


// ============================================================
// NETWORK NAME
// ============================================================

function getNetworkName(chainId) {

    if (chainId === 11155111) {

        return "Ethereum Sepolia";

    }

    if (chainId === 1) {

        return "Ethereum Mainnet";

    }

    return `Chain ${chainId}`;
}


// ============================================================
// ADDRESS SHORTENER
// ============================================================

function shortenAddress(address) {

    if (!address) {
        return "-";
    }

    return (
        address.slice(0, 6) +
        "..." +
        address.slice(-4)
    );
}


// ============================================================
// WALLET ROLE
// ============================================================

async function loadWalletRole() {

    try {

        const adminAddress =
            await contract.admin();


        const isAdmin =
            currentAccount.toLowerCase() ===
            adminAddress.toLowerCase();


        if (isAdmin) {

            walletRole.textContent =
                "Administrator";

            return;
        }


        const isServiceCenter =
            await contract.authorizedServiceCenters(
                currentAccount
            );


        if (isServiceCenter) {

            walletRole.textContent =
                "Authorized Service Center";

            return;
        }


        walletRole.textContent =
            "Vehicle User";


    } catch (error) {

        console.error(
            "Role detection failed:",
            error
        );

        walletRole.textContent =
            "User";
    }
}


// ============================================================
// CHECK WALLET
// ============================================================

function ensureWallet() {

    if (!contract) {

        showNotification(
            "Please connect MetaMask first.",
            "error"
        );

        return false;
    }

    return true;
}


// ============================================================
// REGISTER VEHICLE
// ============================================================

async function registerVehicle() {

    if (!ensureWallet()) return;


    try {

        const vehicleId =
            document.getElementById(
                "vehicleId"
            ).value.trim();


        const registrationNumber =
            document.getElementById(
                "registrationNumber"
            ).value.trim();


        const manufacturer =
            document.getElementById(
                "manufacturer"
            ).value.trim();


        const model =
            document.getElementById(
                "model"
            ).value.trim();


        const owner =
            document.getElementById(
                "ownerAddress"
            ).value.trim();


        if (
            !vehicleId ||
            !registrationNumber ||
            !manufacturer ||
            !model ||
            !owner
        ) {

            showNotification(
                "Please fill all vehicle fields.",
                "error"
            );

            return;
        }


        if (!ethers.isAddress(owner)) {

            showNotification(
                "Invalid owner wallet address.",
                "error"
            );

            return;
        }


        showNotification(
            "Submitting vehicle registration..."
        );


        const tx =
            await contract.registerVehicle(
                vehicleId,
                registrationNumber,
                model,
                manufacturer,
                owner
            );


        await tx.wait();


        showNotification(
            "Vehicle registered successfully!"
        );


        clearInputs([
            "vehicleId",
            "registrationNumber",
            "manufacturer",
            "model",
            "ownerAddress"
        ]);


    } catch (error) {

        console.error(error);

        showNotification(
            getErrorMessage(error),
            "error"
        );
    }
}


// ============================================================
// AUTHORIZE SERVICE CENTER
// ============================================================

async function authorizeServiceCenter() {

    if (!ensureWallet()) return;


    try {

        const address =
            document.getElementById(
                "serviceCenterAddress"
            ).value.trim();


        if (!ethers.isAddress(address)) {

            showNotification(
                "Enter a valid wallet address.",
                "error"
            );

            return;
        }


        showNotification(
            "Authorizing service center..."
        );


        const tx =
            await contract.authorizeServiceCenter(
                address
            );


        await tx.wait();


        showNotification(
            "Service center authorized successfully!"
        );


        document.getElementById(
            "serviceCenterAddress"
        ).value = "";


        await loadWalletRole();


    } catch (error) {

        console.error(error);

        showNotification(
            getErrorMessage(error),
            "error"
        );
    }
}


// ============================================================
// ADD SERVICE RECORD
// ============================================================

async function addServiceRecord() {

    if (!ensureWallet()) return;


    try {

        const vehicleId =
            document.getElementById(
                "serviceVehicleId"
            ).value.trim();


        const description =
            document.getElementById(
                "serviceDescription"
            ).value.trim();


        if (!vehicleId || !description) {

            showNotification(
                "Please enter vehicle ID and service description.",
                "error"
            );

            return;
        }


        showNotification(
            "Adding service record..."
        );


        const tx =
            await contract.addServiceRecord(
                vehicleId,
                description
            );


        await tx.wait();


        showNotification(
            "Service record added successfully!"
        );


        document.getElementById(
            "serviceVehicleId"
        ).value = "";


        document.getElementById(
            "serviceDescription"
        ).value = "";


    } catch (error) {

        console.error(error);

        showNotification(
            getErrorMessage(error),
            "error"
        );
    }
}


// ============================================================
// TRANSFER OWNERSHIP
// ============================================================

async function transferOwnership() {

    if (!ensureWallet()) return;


    try {

        const vehicleId =
            document.getElementById(
                "transferVehicleId"
            ).value.trim();


        const newOwner =
            document.getElementById(
                "newOwnerAddress"
            ).value.trim();


        if (!vehicleId || !newOwner) {

            showNotification(
                "Please fill both fields.",
                "error"
            );

            return;
        }


        if (!ethers.isAddress(newOwner)) {

            showNotification(
                "Invalid new owner address.",
                "error"
            );

            return;
        }


        showNotification(
            "Submitting ownership transfer..."
        );


        const tx =
            await contract.transferOwnership(
                vehicleId,
                newOwner
            );


        await tx.wait();


        showNotification(
            "Ownership transferred successfully!"
        );


        document.getElementById(
            "transferVehicleId"
        ).value = "";


        document.getElementById(
            "newOwnerAddress"
        ).value = "";


    } catch (error) {

        console.error(error);

        showNotification(
            getErrorMessage(error),
            "error"
        );
    }
}


// ============================================================
// SEARCH VEHICLE
// ============================================================

async function searchVehicle() {

    if (!ensureWallet()) return;


    try {

        const vehicleId =
            document.getElementById(
                "searchVehicleId"
            ).value.trim();


        if (!vehicleId) {

            showNotification(
                "Enter a Vehicle ID.",
                "error"
            );

            return;
        }


        showNotification(
            "Searching blockchain..."
        );


        const exists =
            await contract.vehicleExistsCheck(
                vehicleId
            );


        if (!exists) {

            showNotification(
                "Vehicle not found.",
                "error"
            );

            hideSearchResults();

            return;
        }


        // Get vehicle details

        const details =
            await contract.getVehicleDetails(
                vehicleId
            );


        document.getElementById(
            "resultVehicleId"
        ).textContent =
            details[0];


        document.getElementById(
            "resultRegistration"
        ).textContent =
            details[1];


        document.getElementById(
            "resultModel"
        ).textContent =
            details[2];


        document.getElementById(
            "resultManufacturer"
        ).textContent =
            details[3];


        document.getElementById(
            "resultOwner"
        ).textContent =
            details[4];


        document.getElementById(
            "vehicleResult"
        ).classList.remove("hidden");


        // Load histories

        await loadOwnershipHistory(
            vehicleId
        );


        await loadServiceHistory(
            vehicleId
        );


        createPublicHistoryLink(
            vehicleId
        );


        showNotification(
            "Vehicle history loaded."
        );


    } catch (error) {

        console.error(error);

        showNotification(
            getErrorMessage(error),
            "error"
        );
    }
}


// ============================================================
// OWNERSHIP HISTORY
// ============================================================

async function loadOwnershipHistory(
    vehicleId
) {

    const history =
        await contract.getOwnershipHistory(
            vehicleId
        );


    const container =
        document.getElementById(
            "ownershipHistory"
        );


    container.innerHTML = "";


    if (history.length === 0) {

        container.innerHTML =
            "<p>No ownership history found.</p>";

        return;
    }


    history.forEach(
        (record, index) => {

            const owner =
                record.owner;


            const timestamp =
                Number(
                    record.transferredAt
                );


            const date =
                new Date(
                    timestamp * 1000
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "timeline-item";


            item.innerHTML = `
                <h3>
                    Ownership Record ${index + 1}
                </h3>

                <p>
                    Owner:
                    <code>
                        ${owner}
                    </code>
                </p>

                <p>
                    Date:
                    ${formatDate(date)}
                </p>
            `;


            container.appendChild(
                item
            );
        }
    );


    document.getElementById(
        "ownershipSection"
    ).classList.remove("hidden");
}


// ============================================================
// SERVICE HISTORY
// ============================================================

async function loadServiceHistory(
    vehicleId
) {

    const history =
        await contract.getServiceHistory(
            vehicleId
        );


    const container =
        document.getElementById(
            "serviceHistory"
        );


    container.innerHTML = "";


    if (history.length === 0) {

        container.innerHTML =
            "<p>No service records found.</p>";

        return;
    }


    history.forEach(
        (record) => {

            const timestamp =
                Number(
                    record.serviceDate
                );


            const date =
                new Date(
                    timestamp * 1000
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "service-item";


            item.innerHTML = `
                <div class="service-date">
                    ${formatDate(date)}
                </div>

                <div class="service-description">
                    ${escapeHtml(
                        record.description
                    )}
                </div>

                <div class="service-center">
                    Service Center:
                    <code>
                        ${record.serviceCenter}
                    </code>
                </div>
            `;


            container.appendChild(
                item
            );
        }
    );


    document.getElementById(
        "serviceSection"
    ).classList.remove("hidden");
}


// ============================================================
// PUBLIC HISTORY LINK
// ============================================================

function createPublicHistoryLink(
    vehicleId
) {

    const url =
        `${window.location.origin}` +
        `${window.location.pathname
            .replace("index.html", "")}` +
        `history.html?id=${encodeURIComponent(
            vehicleId
        )}`;


    document.getElementById(
        "publicHistoryLink"
    ).textContent =
        url;


    document.getElementById(
        "publicHistorySection"
    ).classList.remove("hidden");


    document.getElementById(
        "openPublicHistoryBtn"
    ).onclick = () => {

        window.open(
            url,
            "_blank"
        );
    };
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(date) {

    return date.toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


// ============================================================
// CLEAR INPUTS
// ============================================================

function clearInputs(ids) {

    ids.forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {

            element.value = "";
        }

    });
}


// ============================================================
// HIDE SEARCH RESULTS
// ============================================================

function hideSearchResults() {

    document.getElementById(
        "vehicleResult"
    ).classList.add("hidden");


    document.getElementById(
        "ownershipSection"
    ).classList.add("hidden");


    document.getElementById(
        "serviceSection"
    ).classList.add("hidden");


    document.getElementById(
        "publicHistorySection"
    ).classList.add("hidden");
}


// ============================================================
// ERROR MESSAGE
// ============================================================

function getErrorMessage(error) {

    if (
        error?.reason
    ) {

        return error.reason;
    }


    if (
        error?.shortMessage
    ) {

        return error.shortMessage;
    }


    if (
        error?.info?.error?.message
    ) {

        return error.info.error.message;
    }


    return "Transaction failed. Check the browser console.";
}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ============================================================
// BUTTON EVENTS
// ============================================================

connectWalletBtn.addEventListener(
    "click",
    connectWallet
);


document.getElementById(
    "registerVehicleBtn"
).addEventListener(
    "click",
    registerVehicle
);


document.getElementById(
    "authorizeServiceCenterBtn"
).addEventListener(
    "click",
    authorizeServiceCenter
);


document.getElementById(
    "addServiceRecordBtn"
).addEventListener(
    "click",
    addServiceRecord
);


document.getElementById(
    "transferOwnershipBtn"
).addEventListener(
    "click",
    transferOwnership
);


document.getElementById(
    "searchVehicleBtn"
).addEventListener(
    "click",
    searchVehicle
);


// ============================================================
// METAMASK ACCOUNT CHANGE
// ============================================================

if (window.ethereum) {

    window.ethereum.on(
        "accountsChanged",
        async (accounts) => {

            if (accounts.length === 0) {

                window.location.reload();

                return;
            }


            await connectWallet();
        }
    );


    window.ethereum.on(
        "chainChanged",
        () => {

            window.location.reload();

        }
    );
}


// ============================================================
// STARTUP
// ============================================================

console.log(
    "VehicleChain DApp loaded."
);