

/*
 * Run testCase in a tight loop
 * for approximately 20 seconds
 *
 * First argument, 'name', is optional
 * Second argument, 'options', is optional
 * tightLoop(
     'Awesome Test',
     { visual: true },
     function() { window.x = 10 * 10; }
   );
 * - or -
 * tightLoop(
     'Awesome Test',
     function() { window.x = 10 * 10; }
   );
 * - or -
 * tightLoop(
     function() { window.x = 10 * 10; }
   );
 */
function tightLoop(name, options, testCase) {

    var D = document,
        
        B = D.body,

        each = function(o, cb) {
            for(var i in o) {
                o.hasOwnProperty(i) && cb(o[i],i,o);
            }
        },

        log = function(m) {
            try {
                console.log(m);
            } catch (e) { }
        },

        now = function now() { return +(new Date()); },

        // target test duration in ms
        TARGET_TEST_DURATION = 4000,

        // only check the time every N tests
        TIMING_RESOLUTION = 5,

        // adjust timing resolution depending on
        effective_timing_resolution = TIMING_RESOLUTION,

        iterations_done = 0,

        t_end_target = now() + TARGET_TEST_DURATION,

        t_start = now(),

        done = false,

        t_end,
        
        result_data;


    // accept single and double argument form
    if (!testCase && !options) {

        testCase = name;
        name = null;
    } else if (!testCase) {

        testCase = options;
        options = null;
    }

    /*
     * Main loop
     */
    while (!done) {

        testCase();

        iterations_done++

        if (!(iterations_done % effective_timing_resolution)) {

            t_end = now();
            done = t_end_target < t_end;

        }
    }

    // prepare response
    result_data = {
        count: iterations_done,
        
        mean: (t_end - t_start) / iterations_done,
        
        elapsed: (t_end - t_start)
    };

    if (name) {
        result_data.name = name;
    }

    if (!options || !options.novisual) {

        var div = D.createElement('div'),

            html = '',

            data_list = '',

            renderPoint = function(value, key) {
                data_list += '<dt>'+key+'</dt><dd>'+value+'</dd>';
            },
            
            untitled = (function() {
                var count = 0;
                return function() {
                    return 'Untitled ' + count++;
                };
            })();

        html += '<h3>'+(result_data.name ? result_data.name : untitled())+'</h3>';

        each(result_data, renderPoint);

        div.innerHTML = html + '<dl>' + data_list + '</dl>';

        div.className = 'tightLoop-result';

        B.appendChild(div);
    }

    if (!options || !options.noconsole) {
        log(result_data);
    }

    return result_data;

}

