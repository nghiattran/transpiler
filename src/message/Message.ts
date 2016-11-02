import {MessageType} from "./MessageType";

export class Message {
    private type : MessageType;
    private body : Object;

    /**
     * Constructor.
     * @param type the message type.
     * @param body the message body.
     */
    public constructor(type : MessageType, body : Object) {
        this.type = type;
        this.body = body;
    }

    /**
     * Getter.
     * @return the message type.
     */
    public getType() : MessageType {
        return this.type;
    }

    /**
     * Getter.
     * @return the message body.
     */
    public getBody() : Object {
        return this.body;
    }
}
