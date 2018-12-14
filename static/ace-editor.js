var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/yaml");

var rows = 9;
var cell_height = 100;
var cell_width = 90;

var icon_height = 50;
var icon_width = 50;

var app = angular.module('myApp', []);
app.controller('myCtrl', ['$scope', function($scope) {
    $scope.jsonData = {}
    $scope.correct_answer = false;
    $scope.question_state = "primary"

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/yaml");

    $scope.typeOfItem = function(item){

        if(typeof(item) == 'object'){

            if(Array.isArray(item)){
                return "array"
            }else{
                return "dictionary"
            }

        }else{
            return(typeof(item))
        }

    }

    var updateJsonData = function(){

        yamlString = editor.getValue();
        try{
            $scope.jsonData = YAML.parse(yamlString);
        }catch(err) {
          console.log(err.message);
        }

    }

    updateJsonData()

    var stageQuestion = function(){
        $scope.silent_change = true
        editor.setValue(YAML.stringify($scope.current_question.stage, 2), 1);
        $scope.silent_change = false
    }

    var checkAnswer = function(){
        if(_.isEqual($scope.jsonData, $scope.current_question.answer)){
            $scope.correct_answer = true;
            $scope.question_state = "success"
        }
    }


    $scope.nextQuestion = function(){
        $scope.current_question_number += 1
        $scope.current_question = questions[$scope.current_question_number]
        $scope.correct_answer = false;
        stageQuestion()
        $scope.question_state = "primary"
    }

    $scope.current_question_number = -1
    $scope.nextQuestion()

    editor.session.on('change', function(delta) {
        // delta.start, delta.end, delta.lines, delta.action
        if($scope.silent_change) return
        console.log("Inside angular")
        console.log(delta)
        updateJsonData()
        $scope.$apply(function(){
            checkAnswer()
        });

    });

}]);


app.directive("box", function() {
    return {
        scope: {
            boxItem: "=",
            parentType: "="
        },
        link: function(scope, element, attrs) {
            scope.typeOfItem = function(item){

                if(typeof(item) == 'object'){

                    if(Array.isArray(item)){
                        return "array"
                    }else{
                        if(scope.allValuesString(item)){
                            //return "properties"
                            return "dictionary"
                        }else{
                            return "dictionary"
                        }
                    }

                }else{
                    return(typeof(item))
                }

            }

            scope.allValuesString = function(item){

                return item && Object.values(item).reduce(function(accumulator, currentValue){
                    return accumulator && (typeof(currentValue)=='string' || typeof(currentValue)=='number' || currentValue==null)
                }, true) || item && Object.values(item).length == 0

            }

        },
        template : "<div ng-class=\"{array: typeOfItem(boxItem) == 'array', dict: typeOfItem(boxItem) == 'dictionary', property: typeOfItem(boxItem) == 'properties', string: typeOfItem(boxItem) == 'string' || typeOfItem(boxItem) == 'number'}\">" +
                        "<img ng-if='boxItem.name' src='static/images/{{ boxItem.name }}.png' style='width: 50px; height:50px;'>" +
                        "<div class='badge badge-pill badge-primary pull-right' style='text-align: right;'>{{ typeOfItem(boxItem) }}</div>" +
//                        "{{ boxItem }}" +

                        "<div ng-if=\"typeOfItem(boxItem) == 'string' || typeOfItem(boxItem) == 'number'\">" +
                            "<img ng-if='parentType!==\"dictionary\"' src='static/images/{{ boxItem }}.png' style='width: 50px; height:50px;'>" +
                            "{{ boxItem }}" +
                        "</div>" +

                        "<div ng-if=\"typeOfItem(boxItem) == 'dictionary'\">" +
                            "<div ng-repeat='(key, value) in boxItem track by $index'>" +
                               "<div class='badge badge-pill badge-success pull-right' style='text-align: right;'>{{ key }}</div>" +
                               "<box parent-type='typeOfItem(boxItem)' ng-if='value' box-item='value'></box>" +
                            "</div>" +
                        "</div>" +


                        "<div ng-if=\"typeOfItem(boxItem) == 'properties'\">" +
                               "<div ng-repeat='(key, value) in boxItem track by $index' class='badge badge-pill badge-success pull-right' style='text-align: right;'>{{ key }}: {{ value }}</div>" +
                        "</div>" +

                        "<div ng-if=\"typeOfItem(boxItem) == 'array'\">" +
                            "<box parent-type='typeOfItem(boxItem)' box-item='item' ng-repeat='item in boxItem track by $index'></box>" +
                        "</div>" +
                   "</div>"
    };
});

var dataToGraph = function(data, start_pos_x, start_pos_y){
    graph.clear();

    $.each(data, function(i, item){
        if(typeof(item) == "string"){
          var image = new joint.shapes.standard.Image();
          var pos_x = start_pos_x + Math.floor(i/rows)*cell_width;
          var pos_y = start_pos_y + (i % rows)*cell_height;
          image.resize(icon_width, icon_height);
          image.position(pos_x, pos_y);
          image.attr('root/title', 'joint.shapes.standard.Image');
          image.attr('label/text', item);
          image.attr('image/xlinkHref', 'static/images/' + item + '.png');
          image.addTo(graph);
        }else if(typeof(item) == "object"){
             if(Array.isArray(item)){
                dataToGraph(jsonData, pos_x, pos_y)
             }else{

             }
        }


    });
}

//editor.session.on('change', function(delta) {
//    // delta.start, delta.end, delta.lines, delta.action
//    console.log("Changed")
//    console.log(delta)
//    yamlString = editor.getValue();
//    jsonData = YAML.parse(yamlString);
//    console.log(jsonData);
//    dataToGraph(jsonData, 0, 0)
//
//});