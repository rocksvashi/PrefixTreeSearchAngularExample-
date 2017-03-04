## Prefix Tree (Trie) Example Using Angular
Use of Prefix Tree (Trie) based search example using Angular. Read more details on the API related to implementations, references etc.
</p>

#### Examples
```js
	// Inject the service
	app.controller('MainCtrl', function($scope, $http, PrefixTree) {
		
		$scope.load = function () {
			$http({
			  method: 'GET',
			  url: 'REMOTE URL'
			}).then(function successCallback(response) {
				angular.forEach(response.items, function(item) {
				  // insert the items in tree.
					PrefixTree.insert("<CONTEXT_KEY>", item.name);
				});
			  });
		}
	}
```

## Created by
- [RocksVashi](https://github.com/rocksvashi)

## License
GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
