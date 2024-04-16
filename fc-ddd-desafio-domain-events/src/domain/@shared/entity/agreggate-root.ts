import EventInterface from "../event/event.interface";

/**
 * Pelo DDD, as classes que possuem agregados
 * são responsáveis pelos seus filhos, logo,
 * são os responsáveis primários pelos eventos
 * do domínio.
 */
export default abstract class AgreggateRoot{
    private _events: EventInterface[];

    protected addEvent(event: EventInterface){
        if( this._events == undefined) this._events = [];
        this._events.push(event);
    }

    public get events(){
        return this._events;
    }

}