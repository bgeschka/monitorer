/*
 * Copyright 2018 Björn Geschka <bjoern@geschka.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
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
