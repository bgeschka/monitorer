define([
	"app",
	"directives/spinner/spinner"
], function(app) {
	app.service("visuals", function($uibModal, $uibModalStack) {

		this.popModal = function() {
			var top = $uibModalStack.getTop();
			if (top) {
				$uibModalStack.dismiss(top.key);
			}
		};
		this.pushModal = function(head, body, foot, dismisscb, size, scopevars) {
			if (!body) body = "";
			if (!foot) foot = "";
			if (!size) size = 'md';
			var modalInstance = $uibModal.open({
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				size: size,
				template: '<div>' +
					'    <div class="modal-header">' +
					'        <h4 class="modal-title" id="modal-title">' + head + '</h4>' +
					'    </div>' +
					'    <div class="modal-body">' +
					body +
					'    </div>' +
					'    <div class="modal-footer">' +
					foot +
					'    </div>' +
					'</div>',
				controller: function($scope, $uibModalInstance) {
                                        if(scopevars) for(var f in scopevars) $scope[f] = scopevars[f];

					$scope.ok = function() {
						$uibModalInstance.close();
					};
					$scope.cancel = function() {
						$uibModalInstance.close();
					};
				}
			}).closed.then(dismisscb);

			return modalInstance;
		};

		this.raiseModal = function(head, body, footer, cb) {
			this.pushModal(head, body, footer, cb);
		};

		this.popSpinner = this.popModal;

		this.pushSpinner = function(text) {
			if (!text) text = "";
			this.pushModal('', '<div spinner>' + text + '</div>', '', function() {});
		};


		return this;
	});
});
