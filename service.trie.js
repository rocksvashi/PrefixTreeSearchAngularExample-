(function() {
	'use strict';
	/*
	 * This service provide an easy API to perform {@see http://en.wikipedia.org/wiki/Trie} search for auto complete text feature.
	 * The API provides a cluster based access to store multi-data sets for different contexts.
	 *  @see https://github.com/odhyan/
	 *  @see http://www.csse.monash.edu.au/~lloyd/tildeAlgDS/Tree/Trie/
	 * Runtime Complexity:
	 * The lookup time for a text is O(k), where k is the length of characters in the text.
	 * 
	 */
	app.factory("PrefixTree", function() {

		function PrefixTree() {
			// holds data for multiple sources based on key
			// each key represents its own tree for efficient insert/search operations.
			var cluster = {};

			/*
			 * Insert a key in given cluster key, if key is undefined, it will allocate a new key and tree root node.
			 * @param key key for the cluster
			 * @param value text to be stored.
			 */
			this.insert = function(key, value) {
				if (cluster[key] === undefined) {
					cluster[key] = new Node();
				}
				
				cluster[key].addNode(value);
			}
			
			/*
			 * Provides a list of options for a given text (autocomplete).
			 * @param key key for the cluster
			 * @param value text to be searched.
			 */
			this.autoComplete = function(key, value) {
				if (cluster[key] === undefined) {
					console.log("no cluster found")
					return;
				}
				
				return cluster[key].autoComplete(value);
			}
			
			// cleanup the datasets
			this.cleanUp =  function () {
				 cluster = {};
			}
			
			return this;
		}

		function Node() {
			this.value;
			this.nodes = [];
			this.word = 0;
		}

		Node.prototype.addNode = function(value, index) {
			var currentNode = this;

			if (index === undefined) {
				index = 0;
			}

			// base condition
			if (index === value.length) {
				currentNode.word++;
				return;
			}

			var char = value[index];
			// check if current node has a child, If not then create a new node
			if (currentNode.nodes[char] === undefined) {
				var node = new Node();
				node.value = char;
				currentNode.nodes[char] = node;
			}

			var childNode = currentNode.nodes[char];
			childNode.addNode(value, index + 1);
		}

		Node.prototype.remove = function(value, index) {
			if (index === undefined) {
				index = 0;
			}

			var currentNode = this;
			// base condition
			if (index === value.length - 1) {
				currentNode.word--;
				delete currentNode.nodes[value[index]];
				return;
			}

			var char = value[index];

			var childNode = currentNode.nodes[char];
			if (childNode !== undefined) {
				childNode.remove(value, index + 1);
			}

			// If parent node subtree has only one node left, then delete that node.
			if (currentNode !== undefined && currentNode.nodes.length == 1) {
				delete currentNode.nodes[value[index + 1]];
			}

		}

		Node.prototype.print = function() {
			var x = []
			for (var k in this.nodes) {
				if (this.nodes[k] !== undefined) {
					if (this.nodes[k].word > 0)
						x.push(this.nodes[k])

					this.nodes[k].print();

				}
			}
			return x;
		}

		Node.prototype.subTree = function(value) {

			var currentNode = this;
			var array = [];

			if (currentNode === undefined) {
				return [];
			}

			if (currentNode.word > 0) {
				array.push(value);
			}

			for (var k in currentNode.nodes) {
				var childNode = currentNode.nodes[k];
				array = array.concat(childNode.subTree(value + k));
			}

			return array;
		}

		Node.prototype.autoComplete = function(value, index) {
			if (value.length == 0) {
				return [];
			}

			if (index === undefined) {
				index = 0;
			}

			var currentNode = this;
			var char = value[index];
			var childNode = currentNode.nodes[char];
			if (childNode === undefined) {
				return [];
			}

			// base condition
			// once scan on input is done, load its entire subtree and return
			if (index === value.length - 1) {
				return childNode.subTree(value);
			}

			return childNode.autoComplete(value, index + 1);
		}
		
		return new PrefixTree();
	});
})();