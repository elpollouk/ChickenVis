Chicken.register("ChickenVis.ActionGroup", [], function () {

	var ActionGroup = Chicken.Class(function (action) {
        this._action = action;
		this._actors = [];
	}, {
		add: function (actors) {
			if (!Array.isArray(actors))
				actors = [ actors ];

			for (var i = 0; i < actors.length; i++)
				this._actors.push(actors[i]);

            var group = this;
            return function () {
                group.remove(actors);
            }
		},

		remove: function (actors) {
			if (!Array.isArray(actors))
				actors = [ actors ];

			for (var i = 0; i < actors.length; i++)
				for (var j = 0; j < this._actors.length; j++)
					if (actors[i] === this._actors[j])
						this._actors.splice(j, 1);
		},

		clear: function () {
			this._actors = [];
		},

        invoke0: function () {
            var action = this._action;
            var actors = this._actors;

            for (var i = 0; i < actors.length; i++)
                actors[i][action]();
        },

        invoke1: function (a) {
            var action = this._action;
            var actors = this._actors;

            for (var i = 0; i < actors.length; i++)
                actors[i][action](a);
        },

        invoke2: function (a, b) {
            var action = this._action;
            var actors = this._actors;

            for (var i = 0; i < actors.length; i++)
                actors[i][action](a, b);
        },

	}, {
        action: {
            get: function () {
                return this._action;
            }
        },
		count: {
            get: function () {
                return this._actors.length;
            },
            enumerable: true
        }
	});

	return ActionGroup;
});
