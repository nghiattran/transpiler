import {Message} from "./Message";

export interface MessageListener {
    /**
     * Called to receive a message sent by a message producer.
     * @param message the message that was sent.
     */
    messageReceived(message : Message) : void;
}
