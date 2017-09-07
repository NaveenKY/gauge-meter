/*=====================================================
 *
 *	GaugeMeter : Canvas based Gauge meter
 *	(c) Naveen Kumar 2017
 *
 ======================================================*/
/*=====================================================
 *	GaugeMeter Object Constructor
 =============================*/
; (function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		root.GaugeMeter = factory();
	}
} (this, function () {
	var GaugeMeter = function GaugeMeter(element, opts) {
		if (!element) {
			throw new Error("No element provided!");
		}
		this.canvas = element;
		if (this.canvas.tagName !== 'CANVAS') {
			throw new Error("HTML Element must of type CANVAS!");
		}
		this.options = {
			color: '#F4A213',
			lineWidth: 20,
			animation: true,
			innerRing: true
		};
		opts = opts || {};
		var that = this;
		Object.keys(opts).forEach(function (key) {
			that.options[key] = opts[key];
		});
		this.prepareElement();
		return this;
	};

	/*=====================================================
	 *	_ Prototype Functions
	 ============================*/
	GaugeMeter.prototype = {
		/*=====================================================
		 *	Prepeare Element : Draw the Gauge for the provided input options
		=============================*/
		prepareElement: function () {
			var ctx = this.canvas.getContext("2d");
			ctx.beginPath();
			ctx.strokeStyle = '#EDEDED';
			ctx.lineWidth = this.options.lineWidth;
			var startX = this.canvas.width / 2;
			var startY = (this.canvas.height - 25);
			var radius = (this.canvas.width - (this.options.lineWidth * 2)) / 2;
			ctx.arc(startX, startY, radius, Math.PI, 3 * Math.PI);
			ctx.stroke();
			ctx.setLineDash([5, 3]);
			ctx.beginPath();
			ctx.lineWidth = 1;
			var dashshedLineStart = (this.canvas.height - radius - this.options.lineWidth - 20);
			var dashshedLineEnd = (this.canvas.height - radius - this.options.lineWidth - 20 + 30);
			ctx.strokeStyle = "#000000";
			ctx.moveTo(this.canvas.width / 2, dashshedLineStart);
			ctx.lineTo(this.canvas.width / 2, dashshedLineEnd);
			ctx.stroke();
			ctx.setLineDash([1, 0]);
			ctx.font = "14px Arial";
			ctx.textAlign = "center";
			ctx.fillStyle = "#999999";
			ctx.fillText("100%", this.canvas.width / 2, dashshedLineStart - 5);
		},
		/*=====================================================
		 *	Set Value : Set the Value for the Guage Meter
		=============================*/
		setValue: function (value, innerValue) {
			if (!value) {
				throw new Error("Provide a value to be set for Gauge meter!");
			}
			if (this.options.innerRing && !innerValue) {
				throw new Error("Please provide value for inner ring!");
			}
			this.innerValue = innerValue;
			var ctx = this.canvas.getContext("2d");
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.prepareElement();
			var startX = this.canvas.width / 2;
			var startY = (this.canvas.height - 25);
			var radius = (this.canvas.width - (this.options.lineWidth * 2)) / 2;
			this.value = value;
			var _this = this;
			function smoothEdges() {
				ctx.beginPath();
				ctx.strokeStyle = '#FFFFFF';
				ctx.lineWidth = 2;
				ctx.arc(startX, startY, radius + 11, 0, 2 * Math.PI);
				ctx.stroke();
				ctx.beginPath();
				ctx.arc(startX, startY, radius - 11, 0, 1.48 * Math.PI);
				ctx.stroke();
				if (_this.innerValue) {
					_this.setInnerValue(_this.innerValue);
				}
			}
			function drawValue(drawnValue) {
				ctx.beginPath();
				ctx.fillStyle = "#FFFFFF";
				ctx.arc(startX, startY, radius - (_this.options.lineWidth / 2) - 15, Math.PI, 3 * Math.PI);
				ctx.fill();
				ctx.beginPath();
				ctx.strokeStyle = _this.options.color;
				ctx.lineWidth = _this.options.lineWidth;
				ctx.arc(startX, startY, radius, 0.85 * Math.PI, ((0.85 * Math.PI) + (0.02042035 * drawnValue)));
				ctx.stroke();
				ctx.font = "36px Arial";
				ctx.textAlign = "center";
				ctx.fillStyle = "#999999";
				ctx.fillText(drawnValue + "%", _this.canvas.width / 2, _this.canvas.height - 20);
				if (drawnValue < _this.value) {
					drawnValue = drawnValue + 1;
					setTimeout(function () {
						drawValue(drawnValue);
					}, 10);
				} else {
					smoothEdges();
				}
			}
			if (this.options.animation) {
				drawValue(1);
			} else {
				drawValue(this.value);
				smoothEdges();
			}
		},
		/*=====================================================
		 *	Set Inner Ring Value : Set the Value for the Inner Ring in Guage Meter
		=============================*/
		setInnerValue: function (value) {
			var ctx = this.canvas.getContext("2d");
			var startX = this.canvas.width / 2;
			var startY = (this.canvas.height - 25);
			var radius = (this.canvas.width - (this.options.lineWidth * 2)) / 2 - (this.options.lineWidth / 2) - 2;
			var _this = this;
			function smoothEdges() {
				ctx.beginPath();
				ctx.strokeStyle = '#FFFFFF';
				ctx.lineWidth = 2;
				ctx.arc(startX, startY, radius - 2, 0, 1.48 * Math.PI);
				ctx.stroke();
			}
			function drawValue(drawnValue) {
				ctx.beginPath();
				ctx.strokeStyle = 'gray';
				ctx.lineWidth = 4;
				ctx.arc(startX, startY, radius, 0.85 * Math.PI, ((0.85 * Math.PI) + (0.02042035 * drawnValue)));
				ctx.stroke();
				if (drawnValue < _this.innerValue) {
					drawnValue = drawnValue + 1;
					setTimeout(function () {
						drawValue(drawnValue);
					}, 10);
				} else {
					smoothEdges();
				}
			}
			if (this.options.animation) {
				drawValue(1);
			} else {
				drawValue(this.innerValue);
				smoothEdges();
			}
		}
	};
	return GaugeMeter;
}));