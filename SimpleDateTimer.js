'use strice'
//startTime:开始时间，Function对象，返回一个Date对象的毫秒时。
//endTime:结束时间,Function对象，返回一个Date对象的毫秒时。

//startTime与endTime策略：
//startTime晚于现在时:倒计时逻辑。
//startTime等于endTime:实时时间显示。
//startTime早于现在时:计算从开始到现在经过了多久。
//应当注意：请返回一致时区的毫秒时,建议使用Date.UTC(),若二者任意为空则施行实时时间刷新方案，而其中一者应当返回Date.now();

//callback:执行结果的回调函数，会传递startTime与endTime之间的结果。

//targetTimer:目标计时器，若为null则不绑定。
//loopInterval:循环周期，毫秒，整数单位，若为0则不循环。

//startTime: start time, Function object, returns a Date object in milliseconds.
//endTime: end time, Function object, returns the millisecond time of a Date object.

//startTime and endTime strategies:
//startTime is later than the present tense: countdown logic.
//startTime is equal to endTime: real-time time display.
//startTime is earlier than the present tense: Calculate how long has passed since the beginning to the present.
//It should be noted: Please use Date.UTC() when returning the same time zone in milliseconds. If both are empty, the real-time time refresh scheme will be implemented, and one of them should return Date.now();

//callback: The callback function of the execution result will pass the result between startTime and endTime.

//targetTimer: target timer, if it is null, it will not be bound.
//loopInterval: loop period, milliseconds, integer unit, if it is 0, it will not loop.


function SimpleDateTimer(startTime, endTime, callback, targetTimer, loopInterval) {
	try {
		let st;
		let et;
		if(startTime == null || endTime == null){
		st = 0;
		et = 0;
		}else{
		st = startTime.call(this);
		et = endTime.call(this);			
		}

		let targetFunc;
		let targetArgs;
		
		if (st > et) {
			targetFunc = countDown;
			targetArgs = {
				'startTime': startTime,
				'endTime': endTime,
				'callback': callback,
			}
		} else if (st == et) {
			targetFunc = realTime;
			targetArgs = {
				'callback': callback
			}
		} else if (st < et) {
			targetFunc = timeDifference;
			targetArgs = {
				'startTime': startTime,
				'endTime': endTime,
				'callback': callback,
			}
		}

		function countDown(startTime, endTime, callback) {
			let result = this.startTime.call(this) - this.endTime.call(this);
			this.callback.call(this,result);
		};

		function realTime(callback) {
			let result = Date.now();
			this.callback.call(this,result);
		};

		function timeDifference(startTime, endTime, callback) {
			let result = this.endTime.call(this) - this.startTime.call(this);
			this.callback.call(this,result);
		};
		
		function doLoop(){
			targetFunc.apply(this,targetArgs);
		}


		if (loopInterval != 0) {
			targetTimer = setInterval(function() {
				doLoop();
			}, loopInterval);

		} else {
			targetTimer = setTimeout(function() {
				doLoop();
			}, loopInterval);
		}

	} catch (e) {
		console.log(e);
	}


}
