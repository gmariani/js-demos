function init() {
    var json =
        '{"previews":[{"name":"Blue Earth", "src":"earth-blue.jpg", "description":"A blue version of Earth.", "views":200},{"name":"User Profile", "src":"user.jpg", "description":"A chubby user guy.", "views":0},{"name":"Mouse", "src":"mouse.jpg", "description":"Standard mouse icon.", "views":99},{"name":"Gold Earth", "src":"earth-gold.jpg", "description":"A gold version of Earth.", "views":7855},{"name":"Page and Pencil", "src":"edit.jpg", "description":"A piece of paper and a pencil.", "views":5},{"name":"Speaker", "src":"speaker.jpg", "description":"A speaker.", "views":16},{"name":"Orange Monitor", "src":"monitor.jpg", "description":"A yellow, glowing monitor.", "views":355},{"name":"Software Box", "src":"package.jpg", "description":"A nice wrapped package in a box.", "views":23452},{"name":"FIRE!!!!", "src":"fire.jpg", "description":"Orange flame.", "views":395},{"name":"Screwdriver Paper", "src":"setting.jpg", "description":"An always useful screwdriver.", "views":42}]}';
    trace(cv.JSON.decode(json));

    trace(cv.JSON.encode(cv));
}
