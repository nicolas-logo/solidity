App = {
    init: async () => {
        await App.loadEthereum();
        await App.loadContracts();
        await App.loadAccount();
        await App.loadTasks();
    },

    loadEthereum: async () => {
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            await App.web3Provider.request({method: 'eth_requestAccounts'});

            console.log("Ethereum loaded");
        } 
        else if (window.web3) {
            App.web3Provider = new Web3(window.web3.currentProvider);
        }
        else {
            console.log("Ethereum not loaded. Install Metamask");
        }
    },

    loadContracts: async () => {
        const res = await fetch("TasksContract.json");
        const tasksContractJSON = await res.json();
        App.contracts.tasksContract = TruffleContract(tasksContractJSON);

        App.contracts.tasksContract.setProvider(App.web3Provider);

        App.tasksContract = await App.contracts.tasksContract.deployed();
    },

    createTask: async (_title, _description) => {
        await App.tasksContract.createTask(
            _title, 
            _description, 
            { from: App.account }
        );
        
        document.location.reload();
    },

    loadAccount: async () => {
        const accounts = await App.web3Provider.request({method: 'eth_requestAccounts'});
        App.account = accounts[0];
        document.querySelector("#wallet-id").innerHTML = App.account;
    },

    loadTasks: async () => {
        const taskCounterResult = await App.tasksContract.taskCounter();
        const taskCounter = taskCounterResult.toNumber();

        for (let i = taskCounter; i >= 1; i--) {
            const task = await App.tasksContract.tasks(i);debugger;
            
            if (!task._deleted) {
                const taskCard =
                `
                <div class="card bg-dark mb-2">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><h4>${ task.title }</h4></span>
                        <div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" onchange="App.toggleTask(${task.id})" type="checkbox" ${task.done && "checked"} />
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <span>${ task.description }</span>
                        <p class="text-muted">Created: ${new Date(task.createdAt * 1000)}</p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-danger" onclick="App.deleteTask(${task.id})">Delete</button>
                    </div>
                </div>
                `;
            
                const taskList = document.querySelector("#task-list");
                taskList.innerHTML += taskCard;
            }  
        }
        
    },

    toggleTask: async (_id) => {
        await App.tasksContract.toggleDone(_id, { from: App.account });
        document.location.reload();
    },

    deleteTask: async (_id) => {
        await App.tasksContract.deleteTask(_id, { from: App.account });
        document.location.reload();
    },

    web3Provider: '',
    contracts: {}
}

App.init();