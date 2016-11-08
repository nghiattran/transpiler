import {Message} from "./Message";
import {MessageListener} from "./MessageListener";


export class MessageHandler {
    private message : Message;                       // message
    private listeners : MessageListener[] = [];  // listener list

    /**
     * Constructor.
     */
    public constructor() {

    }

    /**
     * Add a listener to the listener list.
     * @param listener the listener to add.
     */
    public addListener (listener : MessageListener) : void
    {
        this.listeners.push(listener);
    }

    /**
     * Remove a listener from the listener list.
     * @param listener the listener to remove.
     */
    public removeListener(listener : MessageListener) : void {
        let index = this.listeners.indexOf(listener, 0);
        if (index > -1) {
           this.listeners.splice(index, 1);
        }
    }

    /**
     * Notify listeners after setting the message.
     * @param message the message to set.
     */
    public sendMessage(message : Message) : void {
        this.message = message;
        this.notifyListeners();
    }

    /**
     * Notify each listener in the listener list by calling the listener's
     * messageReceived() method.
     */
    private notifyListeners() : void {
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i].messageReceived(this.message);
        }
    }
}
