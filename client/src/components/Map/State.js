import * as React from "react";

export class State extends React.Component {

    constructor(props) {
        super(props);
        this.onInteractionHandler = this.onInteractionHandler.bind(this);
    }

    onInteractionHandler() {
        // const { stateName } = this.props;
    }

    render() {
        const { mapType, feature, path, radius, fill, i } = this.props;

        return (
            <path
                className={`states state-transition-${i}`}
                d={path}
                fill={fill}
                stroke="#151616"
                strokeWidth={0.25}
                onMouseEnter={this.onInteractionHandler}
                onClick={this.onInteractionHandler}
                onTouchStart={this.onInteractionHandler}
            />
        );
    }
}