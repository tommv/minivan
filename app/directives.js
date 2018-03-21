'use strict';

/* Services */

angular.module('app.directives', [])

.directive('projectTitleBar', function(
  ){
    return {
      restrict: 'E',
      scope: {
      },
      templateUrl: 'components/projectTitleBar.html'
    }
  })

.directive('attributeListElement', function(
  ){
    return {
      restrict: 'A',
      scope: {
      	att: '=',
      	printMode: '=',
      	detailLevel: '=',
      	selectedAttId: '='
      },
      templateUrl: 'components/attributeListElement.html',
      link: function($scope, el, attrs) {
      	$scope.isSelected = false
      	$scope.$watch('selectedAttId', function(){
      		$scope.isSelected = $scope.att && $scope.att.id && $scope.selectedAttId == $scope.att.id
      	})
      	$scope.selectAtt = function(){
      		if (!$scope.printMode) {
      			if ($scope.selectedAttId == $scope.att.id) {
      				$scope.isSelected = false
		      		$scope.selectedAttId = undefined
      			} else {
		      		$scope.isSelected = true
		      		$scope.selectedAttId = $scope.att.id
      			}
      		}
      	}
      }
    }
  })

.directive('vColorKey', function($timeout, networkData, scalesUtils){
  return {
    restrict: 'E',
    template: '<small style="opacity:0.5;">.<br>.<br>.</small>',
    scope: {
      att: '='
    },
    link: function($scope, el, attrs) {
      $scope.$watch('att', redraw, true)
      window.addEventListener('resize', redraw)
      $scope.$on('$destroy', function(){
        window.removeEventListener('resize', redraw)
      })

      var g = networkData.g

      var container = el[0]

      function redraw(){
        $timeout(function(){
          container.innerHTML = '';

          var settings = {}

          // Canvas size
          settings.oversampling = 2
          settings.width =  container.offsetWidth
          settings.height = container.offsetHeight

          var y
          var width = settings.oversampling * settings.width
          var height = settings.oversampling * settings.height

          console.log(width, height)
          
          // Create the canvas
          container.innerHTML = '<div style="width:'+settings.width+'; height:'+settings.height+';"><canvas id="cnvs" width="'+width+'" height="'+height+'" style="width: 100%;"></canvas></div>'
          var canvas = container.querySelector('#cnvs')
          var ctx = canvas.getContext("2d")

          // Color scale
          var getColor = scalesUtils.getColorScale(height, 0, $scope.att.colorScale)

          for (y=0; y<height; y++) {
            ctx.beginPath()
            ctx.lineCap="square"
            ctx.strokeStyle = getColor(y)
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.lineWidth = 1
            ctx.moveTo(0, y)
            ctx.lineTo(width, y)
            ctx.stroke()
            ctx.closePath()
          }

          // Colors
          /*var getColor
          if ($scope.att.type == 'partition') {
            var colorsIndex = {}
            $scope.att.modalities.forEach(function(modality){
              colorsIndex[modality.value] = modality.color
            })
            getColor = function(d){
              return d3.color(colorsIndex[d] || '#999')
            }
          } else if ($scope.att.type == 'ranking-size') {
            getColor = scalesUtils.getSizeAsColorScale($scope.att.min, $scope.att.max, $scope.att.areaScaling.min, $scope.att.areaScaling.max, $scope.att.areaScaling.interpolation)
          } else if ($scope.att.type == 'ranking-color') {
            getColor = scalesUtils.getColorScale($scope.att.min, $scope.att.max, $scope.att.colorScale)
          } else {
            getColor = function(){ return d3.color('#000') }
          }*/

        })
      }
    }
  }
})
