var el,
    hammer,
    counter;

module('Test recognizer enable', {
    setup: function() {
        el = utils.createHitArea()
        hammer = new Hammer.Manager(el, {recognizers: []});
        counter = 0;
    },
    teardown: function() {
        hammer && hammer.destroy();
    }
});

test('should disable a recognizer through the `enable` constructor parameter', function() {
    expect(1);
    hammer.add(new Hammer.Tap({enable: false}));
    hammer.on('tap', function() {
        counter++;
    });

    stop();
    utils.dispatchTouchEvent(el, 'start', 50, 50);
    utils.dispatchTouchEvent(el, 'end', 50, 50);

    setTimeout(function() {
        start();
        equal(counter, 0);
    }, 100);
});

test('should toggle a recognizer using the `set` call to the recognizer enable property', function() {
    expect(2);

    hammer.add(new Hammer.Tap());
    hammer.on('tap', function() {
        counter++;
    });

    utils.dispatchTouchEvent(el, 'start', 50, 50);
    utils.dispatchTouchEvent(el, 'end', 50, 50);
    equal(counter, 1);

    hammer.get('tap').set('enable', false);

    utils.dispatchTouchEvent(el, 'start', 50, 50);
    utils.dispatchTouchEvent(el, 'end', 50, 50);
    equal(counter, 1);
});

test('should accept the `enable` constructor parameter as function', function() {
    expect(2);

    var canRecognizeTap = false;

    var tap = new Hammer.Tap({
        enable: function() {
            return canRecognizeTap;
        }
    });

    hammer.add(tap);
    hammer.on('tap', function() {
        counter++;
    });

    stop();
    utils.dispatchTouchEvent(el, 'start', 50, 50);
    utils.dispatchTouchEvent(el, 'end', 50, 50);

    setTimeout(function() {
        start();
        equal(counter, 0);

        canRecognizeTap = true;

        utils.dispatchTouchEvent(el, 'start', 50, 50);
        utils.dispatchTouchEvent(el, 'end', 50, 50);

        equal(counter, 1);
    }, 100);
});

test('should accept a function parameter with `set`', function() {
    expect(3);

    hammer.add(new Hammer.Tap());
    hammer.on('tap', function() {
        counter++;
    });

    utils.dispatchTouchEvent(el, 'start', 50, 50);
    utils.dispatchTouchEvent(el, 'end', 50, 50);
    equal(counter, 1);

    var canRecognizeTap = false;
    hammer.get('tap').set('enable', function() {
        return canRecognizeTap;
    });

    utils.dispatchTouchEvent(el, 'start', 50, 50);
    utils.dispatchTouchEvent(el, 'end', 50, 50);
    equal(counter, 1);

    canRecognizeTap = true;
    utils.dispatchTouchEvent(el, 'start', 50, 50);
    utils.dispatchTouchEvent(el, 'end', 50, 50);
    equal(counter, 2);
});

test('should pass the recognizer and input parameter to the `enable` callback', function() {
    expect(2);

    var tap,
        event;

    var canEnable = function(recognizer, input) {
        equal(recognizer, tap);
        equal(input.srcEvent, event);
    }
    tap = new Hammer.Tap({enable: canEnable});
    hammer.add(tap);

    event = utils.createTouchEvent('start', 50, 50, 0);
    el.dispatchEvent(event);
});
