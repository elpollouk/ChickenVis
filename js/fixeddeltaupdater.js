Chicken.register("ChickenVis.FixedDeltaUpdater", [], function () {
	"use strict";

	// Smoothes out the delta times passed into update() so that the specified onupdate() function
	// gets called with a fixed delta time over a given period of time
	// Works with either milliseconds or fraction seconds
	// Implementation inspired by Glen Fiedler (gafferongames.com)
	var FixedDeltaUpdater = Chicken.Class(function FixedDeltaUpdater(onupdate, deltaTime) {
		this._onupdate = onupdate;
		this._deltaTime = deltaTime;
        this.reset();
	}, {
        reset: function FixedDeltaUpdater_reset() {
            this._time = 0;
            this._accumulator = 0;
        },

		update: function FixedDeltaUpdater_update(dt) {
			this._accumulator += dt;

			dt = this._deltaTime; // Save a this reference
			while (this._accumulator >= dt) {
				this._onupdate(dt, this._time);
				this._time += dt;
				this._accumulator -= dt;
			}
		}
	}, {
		deltaTime: {
			get: function FixedDeltaUpdater_deltaTime_get() {
				return this._deltaTime;
			},
			enumerable: true
		},
		currentTime: {
			get: function FixedDeltaUpdater_currentTime_get() {
				return this._time;
			},
			enumerable: true
		}
	});

    return FixedDeltaUpdater;
});
