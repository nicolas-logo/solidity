 const TasksContract = artifacts.require("TasksContract");

 contract("TasksContract", async () => {

    before(async () => {
        this.taskContract = await TasksContract.deployed();
    });
    
    it("should have an address", async () => {
        const address = this.taskContract.address;

        assert.isDefined(address, "Address is not defined");
    });

    it("should have the correct initial task", async () => {
        const taskCounter = await this.taskContract.taskCounter();
        const task = await this.taskContract.tasks(taskCounter);

        assert.equal(task.id.toNumber(), taskCounter);
        assert.equal(task.title, "Example task");
        assert.equal(task.description, "Go to the market");
        assert.equal(task.done, false);
        assert.equal(taskCounter, 1);      
    });

    it("should create a new task correctly ", async () => {
        const taskCreatedResult = await this.taskContract.createTask(
            "New Task",
            "New Task Description"
        );
        const taskCreated = taskCreatedResult.logs[0].args;

        const taskCounter = await this.taskContract.taskCounter();
        

        assert.equal(taskCreated.id.toNumber(), taskCounter);
        assert.equal(taskCreated.title, "New Task");
        assert.equal(taskCreated.description, "New Task Description");
        assert.equal(taskCreated.done, false);
        assert.equal(taskCounter, 2);      
    });

    it("should toggle to done correctly ", async () => {

        let task = await this.taskContract.tasks(1);

        assert.equal(task.done, false);

        const taskToggleResult = await this.taskContract.toggleDone(task.id);
        task = await this.taskContract.tasks(1);

        assert.equal(taskToggleResult.logs[0].args.done, true);
        assert.equal(task.done, true);    
    });
    
 })