class OuterUI {
    constructor(){
        this.emitter = EventDispatcher.getInstance();
        const buttonPanel = document.createElement("div");
        document.body.append(buttonPanel);
        this.buttons = []; // not even used
        //this.addAllButtons()
    };

    addTurnButton(){
        const turnButton = document.createElement("button");
        turnButton.textContent = "Next Turn";
        turnButton.addEventListener("click", () => {
            //here
            this.emitter.emit("next-turn");
        })
        document.body.append(turnButton);
        this.buttons.push(turnButton);
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
    addAllButtons(){
        this.addTurnButton();
        this.addDoButtons();
    }

    //the undo parameter is supposed to be a boolean, if true it is undo, if false it is redo. 
    doFunction(button, undo){
        if(undo){
            this.emitter.emit("undo");
        }else{
            this.emitter.emit("redo");
        }
    }
}