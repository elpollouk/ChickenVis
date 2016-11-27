Chicken.register("ChickenVis.ActionGroup", [], function () {

	var ActionGroup = Chicken.Class(function ActionGroup(action) {
        this._action = action;
		this._actors = [];
	}, {
		add: function ActionGroup_add(actors) {
			if (!Array.isArray(actors))
				actors = [ actors ];

			for (var i = 0; i < actors.length; i++)
				this._actors.push(actors[i]);

            var group = this;
            return function () {
                group.remove(actors);
            }
		},

		remove: function ActionGroup_remove(actors) {
			if (!Array.isArray(actors))
				actors = [ actors ];

			for (var i = 0; i < actors.length; i++)
				for (var j = 0; j < this._actors.length; j++)
					if (actors[i] === this._actors[j])
						this._actors.splice(j, 1);
		},

		clear: function ActionGroup_clear() {
			this._actors = [];
		},

        invoke0: function ActionGroup_invoke0() {
            var action = this._action;
            var actors = this._actors;

            for (var i = 0; i < actors.length; i++)
                actors[i][action]();
        },

        invoke1: function ActionGroup_invoke1(a) {
            var action = this._action;
            var actors = this._actors;

            for (var i = 0; i < actors.length; i++)
                actors[i][action](a);
        },

        invoke2: function ActionGroup_invoke2(a, b) {
            var action = this._action;
            var actors = this._actors;

            for (var i = 0; i < actors.length; i++)
                actors[i][action](a, b);
        },

	}, {
        action: {
            get: function ActionGroup_action_get() {
                return this._action;
            }
        },
		count: {
            get: function ActionGroup_count_get() {
                return this._actors.length;
            },
            enumerable: true
        }
	});

	return ActionGroup;
});
