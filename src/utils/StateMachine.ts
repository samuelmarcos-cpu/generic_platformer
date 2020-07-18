export interface InterfaceState {
    enter(...args: any[]): void
    execute(...stateArgs: any[]): void
}

export abstract class State implements InterfaceState {
    stateMachine?: StateMachine

    abstract enter(...args: any[]): void
    abstract execute(...stateArgs: any[]): void
}

type NamedStates = { [key: string]: State }

export class StateMachine {
    private readonly initialState: string
    private readonly stateArgs: any[]
    private readonly possibleStates: NamedStates
    private state?: string

    constructor(initialState: string, possibleStates: NamedStates, stateArgs: any[] = []) {
        this.initialState = initialState
        this.possibleStates = possibleStates
        this.stateArgs = stateArgs

        Object.keys(this.possibleStates)
            .map(name => this.possibleStates[name])
            .forEach(state => {
                state.stateMachine = this
            })
    }

    private getCurrentState() {
        return this.possibleStates[this.state || this.initialState]
    }

    transition(newState: string, ...enterArgs: any[]) {
        this.state = newState
        this.getCurrentState().enter(...[...this.stateArgs, ...enterArgs])
    }

    step() {
        if (this.state == undefined) {
            this.transition(this.initialState)
        }
        this.getCurrentState().execute(...this.stateArgs)
    }
}
