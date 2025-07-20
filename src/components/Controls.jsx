import React from 'react';
import '../styles/Controls.css';

export default function Controls() {
    return (
        <div className="controls-container">
            <div className="button-group">
                <button>Start</button>
                <button>Pause</button>
                <button>Reset</button>
                <button>Randomize</button>
            </div>
            <div className="slider-group">
                <label>
                    Speed:
                    <input typr="range" min="1" max="10" />
                </label>
                <label>
                    Size:
                    <input typr="range" min="5" max="100" />
                </label>
            </div>
        </div>
    );
}