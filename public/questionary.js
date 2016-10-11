angular.module('questionaryApp', [])
  .controller('myController', ['$scope', '$http', function($scope, $http) {
    // ページロード時
    $http({
      method: 'GET',
      url:    '/api/list'
    })
    .success(function (data, status, headers, config) {
        $scope.members = data;
    })
    .error(function (data, status, headers, config) {
        $scope.members = '通信に失敗しました。';
    });

    // 登録ボタン押下時
    $scope.register = function() {
      $scope.question = '登録します。よろしいですか？';
      $scope.arg1 = "register";
      $('#modal-question').modal();
    };

    // キャンセルボタン押下時
    $scope.cancel = function() {
      $scope.question = 'キャンセルすると入力した値が失われます。よろしいですか？';
      $scope.arg1 = "cancel";
      $('#modal-question').modal();
    };

    // モーダルから「はい」をクリックした場合
    $scope.question_yes = function() {
      // キャンセルの場合はトップへ戻る。
      if ($scope.arg1 == "cancel") { window.location.href = "/"; }

      // 登録の場合は登録処理へ
      if ($scope.arg1 == "register") {
        var send_obj = registration();
        $http({
          method: 'POST',
          url:    '/api/answer',
          data:   { send_obj }
        })
        .success(function (data, status, headers, config) {
          $scope.message = "正常に登録されました。";
          $scope.arg2 = "register";
          $('#modal-message').modal();
        })
        .error(function (data, status, headers, config) {
            $scope.members = '通信に失敗しました。';
        });


      }
    };

    // モダールから「OK」をクリックした場合
    $scope.message_ok = function() {
      // 登録の場合はトップへ戻る。
      if ($scope.arg2 == "register") { window.location.href = "/"; }
    };


  }]);

/*
 * データのDBへの登録
 */
registration = function() {
  var date = new Date()
  var no = 'N';
  no = no + date.getFullYear();
  no = no + (date.getMonth() + 1);
  no = no + date.getDate();
  no = no + date.getHours();
  no = no + date.getMinutes();
  no = no + date.getSeconds();
  no = no + date.getMilliseconds();

  var total = [];
  for (var i = 0; i < 5; i++) {
    var obj = {};
    obj.no = no;
    obj.akno = 1001;
    obj.qno = i + 1;
    obj.answer = $('#qa' + String(i)).val();
    total.push(obj);
  }
  var json_obj = window.JSON.stringify(total);
  //var json_obj = total;
  //var json_obj = total;
  console.log(json_obj);
  return json_obj;
}
