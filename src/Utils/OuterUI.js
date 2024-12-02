class OuterUI{
    constructor(){
        const buttonPanel = document.createElement("div");
        document.body.append(buttonPanel);
        this.buttons = [];
    };

    addSaveButton(){
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save Game"; 
        saveButton.addEventListener("click", () => {
            //here
        })
        document.body.append(saveButton);
        this.buttons.push(saveButton);
    }
    addRestoreButton(){
        const restoreButton = document.createElement("button");
        restoreButton.textContent = "Restore Save"; 
        restoreButton.addEventListener("click", () => {
            //here
        })
        document.body.append(restoreButton);
        this.buttons.push(restoreButton);
    }
    addDoButtons(){
        const doButtons = Array.from(
            { length: 2 },
            () => document.createElement("button"),
        );
        const buttonTxt = ["undo", "redo"];
        doButtons.forEach((button, i) => {
            button.innerHTML = `${buttonTxt[i]}`;
            button.addEventListener("click", () => {
                this.doFunction(button, i == 0); //function needs to be filled
            })
            document.body.append(button);
            this.buttons.push(button);
        })
    }
    addTurnButton(){
        const turnButton = document.createElement("button");
        turnButton.textContent = "Next Turn";
        turnButton.addEventListener("click", () => {
            //here
        })
        document.body.append(turnButton);
        this.buttons.push(turnButton);
    }
    addLocalClearButton(){
        const clearButton = document.createElement("button");
        clearButton.textContent = "Clear Local Storage";
        clearButton.addEventListener("click", () => {
            //here
        })
        document.body.append(clearButton);
        this.buttons.push(clearButton);
    }
    addAllButtons(){
        this.addTurnButton();
        this.addDoButtons();
        this.addSaveButton();
        this.addRestoreButton();
        this.addLocalClearButton();
        
    }
    //the undo parameter is supposed to be a boolean, if true it is undo, if false it is redo. 
    doFunction(button, undo){}
}