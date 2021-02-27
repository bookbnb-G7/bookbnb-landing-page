/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "c64ad518ecf76ee3812e"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(1);

var _rqrauhvmra__tobi = __webpack_require__(2);

var _rqrauhvmra__tobi2 = _interopRequireDefault(_rqrauhvmra__tobi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// CSS and SASS files
var tobi = new _rqrauhvmra__tobi2.default();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Tobi
 *
 * @author rqrauhvmra
 * @version 1.7.3
 * @url https://github.com/rqrauhvmra/Tobi
 *
 * MIT License
 */
(function (root, factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    root.Tobi = factory()
  }
}(this, function () {
  'use strict'

  var Tobi = function Tobi (userOptions) {
    /**
     * Global variables
     *
     */
    var config = {},
      browserWindow = window,
      transformProperty = null,
      gallery = [],
      figcaptionId = 0,
      elementsLength = 0,
      lightbox = null,
      slider = null,
      sliderElements = [],
      prevButton = null,
      nextButton = null,
      closeButton = null,
      counter = null,
      currentIndex = 0,
      drag = {},
      pointerDown = false,
      lastFocus = null,
      firstFocusableEl = null,
      lastFocusableEl = null,
      offset = null,
      offsetTmp = null,
      resizeTicking = false,
      x = 0

    /**
     * Merge default options with user options
     *
     * @param {Object} userOptions - Optional user options
     * @returns {Object} - Custom options
     */
    var mergeOptions = function mergeOptions (userOptions) {
      // Default options
      var options = {
        selector: '.lightbox',
        captions: true,
        captionsSelector: 'img',
        captionAttribute: 'alt',
        nav: 'auto',
        navText: ['<svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24"><polyline points="14 18 8 12 14 6 14 6"></polyline></svg>', '<svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24"><polyline points="10 6 16 12 10 18 10 18"></polyline></svg>'],
        navLabel: ['Previous', 'Next'],
        close: true,
        closeText: '<svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24"><path d="M6.34314575 6.34314575L17.6568542 17.6568542M6.34314575 17.6568542L17.6568542 6.34314575"></path></svg>',
        closeLabel: 'Close',
        counter: true,
        download: false, // TODO
        downloadText: '', // TODO
        downloadLabel: 'Download', // TODO
        keyboard: true,
        zoom: true,
        zoomText: '<svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4,20 L9.58788778,14.4121122"></path><path d="M14,16 C10.6862915,16 8,13.3137085 8,10 C8,6.6862915 10.6862915,4 14,4 C17.3137085,4 20,6.6862915 20,10 C20,13.3137085 17.3137085,16 14,16 Z"></path><path d="M16.6666667 10L11.3333333 10M14 7.33333333L14 12.6666667"></path></svg>',
        docClose: true,
        swipeClose: true,
        scroll: false,
        draggable: true,
        threshold: 100,
        rtl: false, // TODO
        loop: false, // TODO
        autoplayVideo: false
      }

      if (userOptions) {
        Object.keys(userOptions).forEach(function (key) {
          options[key] = userOptions[key]
        })
      }

      return options
    }

    /**
     * Determine if browser supports unprefixed transform property
     *
     * @returns {string} - Transform property supported by client
     */
    var transformSupport = function transformSupport () {
      return typeof document.documentElement.style.transform === 'string' ? 'transform' : 'WebkitTransform'
    }

    /**
     * Types - you can add new type to support something new
     *
     */
    var supportedElements = {
      image: {
        checkSupport: function (element) {
          return !element.hasAttribute('data-type') && element.href.match(/\.(png|jpe?g|tiff|tif|gif|bmp|webp|svg|ico)$/)
        },

        init: function (element, container) {
          var figure = document.createElement('figure'),
            figcaption = document.createElement('figcaption'),
            image = document.createElement('img'),
            thumbnail = element.querySelector('img'),
            loader = document.createElement('div')

          image.style.opacity = '0'

          if (thumbnail) {
            image.alt = thumbnail.alt || ''
          }

          image.setAttribute('src', '')
          image.setAttribute('data-src', element.href)

          // Add image to figure
          figure.appendChild(image)

          // Create figcaption
          if (config.captions) {
            figcaption.style.opacity = '0'

            if (config.captionsSelector === 'self' && element.getAttribute(config.captionAttribute)) {
              figcaption.textContent = element.getAttribute(config.captionAttribute)
            } else if (config.captionsSelector === 'img' && thumbnail && thumbnail.getAttribute(config.captionAttribute)) {
              figcaption.textContent = thumbnail.getAttribute(config.captionAttribute)
            }

            if (figcaption.textContent) {
              figcaption.id = 'tobi-figcaption-' + figcaptionId
              figure.appendChild(figcaption)

              image.setAttribute('aria-labelledby', figcaption.id)

              ++figcaptionId
            }
          }

          // Add figure to container
          container.appendChild(figure)

          //  Create loader
          loader.className = 'tobi-loader'

          // Add loader to container
          container.appendChild(loader)

          // Register type
          container.setAttribute('data-type', 'image')
        },

        onPreload: function (container) {
          // Same as preload
          supportedElements.image.onLoad(container)
        },

        onLoad: function (container) {
          var image = container.querySelector('img')

          if (!image.hasAttribute('data-src')) {
            return
          }

          var figcaption = container.querySelector('figcaption'),
            loader = container.querySelector('.tobi-loader')

          image.onload = function () {
            container.removeChild(loader)
            image.style.opacity = '1'

            if (figcaption) {
              figcaption.style.opacity = '1'
            }
          }

          image.setAttribute('src', image.getAttribute('data-src'))
          image.removeAttribute('data-src')
        },

        onLeave: function (container) {
          // Nothing
        },

        onCleanup: function (container) {
          // Nothing
        }
      },

      youtube: {
        checkSupport: function (element) {
          return checkType(element, 'youtube')
        },

        init: function (element, container) {
          // TODO
        },

        onPreload: function (container) {
          // Nothing
        },

        onLoad: function (container) {
          // TODO
        },

        onLeave: function (container) {
          // TODO
        },

        onCleanup: function (container) {
          // Nothing
        }
      },

      iframe: {
        checkSupport: function (element) {
          return checkType(element, 'iframe')
        },

        init: function (element, container) {
          var iframe = document.createElement('iframe'),
            href = element.hasAttribute('href') ? element.getAttribute('href') : element.getAttribute('data-target')

          iframe.setAttribute('frameborder', '0')
          iframe.setAttribute('src', '')
          iframe.setAttribute('data-src', href)

          // Add iframe to container
          container.appendChild(iframe)

          // Register type
          container.setAttribute('data-type', 'iframe')
        },

        onPreload: function (container) {
          // Nothing
        },

        onLoad: function (container) {
          var iframe = container.querySelector('iframe')

          iframe.setAttribute('src', iframe.getAttribute('data-src'))
        },

        onLeave: function (container) {
          // Nothing
        },

        onCleanup: function (container) {
          // Nothing
        }
      },

      html: {
        checkSupport: function (element) {
          return checkType(element, 'html')
        },

        init: function (element, container) {
          var targetSelector = element.hasAttribute('href') ? element.getAttribute('href') : element.getAttribute('data-target'),
            target = document.querySelector(targetSelector)

          if (!target) {
            throw new Error('Ups, I can\'t find the target ' + targetSelector + '.')
          }

          // Add content to container
          container.appendChild(target)

          // Register type
          container.setAttribute('data-type', 'html')
        },

        onPreload: function (container) {
          // Nothing
        },

        onLoad: function (container) {
          var video = container.querySelector('video')

          if (video) {
            if (video.hasAttribute('data-time') && video.readyState > 0) {
              // Continue where video was stopped
              video.currentTime = video.getAttribute('data-time')
            }

            if (config.autoplayVideo) {
              // Start playback (and loading if necessary)
              video.play()
            }
          }
        },

        onLeave: function (container) {
          var video = container.querySelector('video')

          if (video) {
            if (!video.paused) {
              // Stop if video is playing
              video.pause()
            }

            // Backup currentTime (needed for revisit)
            if (video.readyState > 0) {
              video.setAttribute('data-time', video.currentTime)
            }
          }
        },

        onCleanup: function (container) {
          var video = container.querySelector('video')

          if (video) {
            if (video.readyState > 0 && video.readyState < 3 && video.duration !== video.currentTime) {
              // Some data has been loaded but not the whole package.
              // In order to save bandwidth, stop downloading as soon as possible.
              var clone = video.cloneNode(true)

              removeSources(video)
              video.load()

              video.parentNode.removeChild(video)

              container.appendChild(clone)
            }
          }
        }
      }
    }

    /**
     * Init
     *
     */
    var init = function init (userOptions) {
      // Merge user options into defaults
      config = mergeOptions(userOptions)

      // Transform property supported by client
      transformProperty = transformSupport()

      // Get a list of all elements within the document
      var elements = document.querySelectorAll(config.selector)

      if (!elements) {
        throw new Error('Ups, I can\'t find the selector ' + config.selector + '.')
      }

      // Execute a few things once per element
      Array.prototype.forEach.call(elements, function (element) {
        add(element)
      })
    }

    /**
     * Add element
     *
     * @param {HTMLElement} element - Element to add
     * @param {function} callback - Optional callback to call after add
     */
    var add = function add (element, callback) {
      // Check if the lightbox already exists
      if (!lightbox) {
        // Create the lightbox
        createLightbox()
      }

      // Check if element already exists
      if (gallery.indexOf(element) === -1) {
        gallery.push(element)
        elementsLength++

        // Set zoom icon if necessary
        if (config.zoom && element.querySelector('img')) {
          var tobiZoom = document.createElement('div')

          tobiZoom.className = 'tobi-zoom__icon'
          tobiZoom.innerHTML = config.zoomText

          element.classList.add('tobi-zoom')
          element.appendChild(tobiZoom)
        }

        // Bind click event handler
        element.addEventListener('click', function (event) {
          event.preventDefault()

          open(gallery.indexOf(this))
        })

        // Create the slide
        createLightboxSlide(element)

        if (isOpen()) {
          updateLightbox()
        }

        if (callback) {
          callback.call(this)
        }
      } else {
        throw new Error('Ups, element already added to the lightbox.')
      }
    }

    /**
     * Create the lightbox
     *
     */
    var createLightbox = function createLightbox () {
      // Create lightbox container
      lightbox = document.createElement('div')
      lightbox.setAttribute('role', 'dialog')
      lightbox.setAttribute('aria-hidden', 'true')
      lightbox.className = 'tobi'

      // Create slider container
      slider = document.createElement('div')
      slider.className = 'tobi__slider'
      lightbox.appendChild(slider)

      // Create previous button
      prevButton = document.createElement('button')
      prevButton.className = 'tobi__prev'
      prevButton.setAttribute('type', 'button')
      prevButton.setAttribute('aria-label', config.navLabel[0])
      prevButton.innerHTML = config.navText[0]
      lightbox.appendChild(prevButton)

      // Create next button
      nextButton = document.createElement('button')
      nextButton.className = 'tobi__next'
      nextButton.setAttribute('type', 'button')
      nextButton.setAttribute('aria-label', config.navLabel[1])
      nextButton.innerHTML = config.navText[1]
      lightbox.appendChild(nextButton)

      // Create close button
      closeButton = document.createElement('button')
      closeButton.className = 'tobi__close'
      closeButton.setAttribute('type', 'button')
      closeButton.setAttribute('aria-label', config.closeLabel)
      closeButton.innerHTML = config.closeText
      lightbox.appendChild(closeButton)

      // Create counter
      counter = document.createElement('div')
      counter.className = 'tobi__counter'
      lightbox.appendChild(counter)

      // Resize event using requestAnimationFrame
      browserWindow.addEventListener('resize', function () {
        if (!resizeTicking) {
          resizeTicking = true
          browserWindow.requestAnimationFrame(function () {
            updateOffset()
            resizeTicking = false
          })
        }
      })

      document.body.appendChild(lightbox)
    }

    /**
     * Create a lightbox slide
     *
     */
    var createLightboxSlide = function createLightboxSlide (element) {
      // Detect type
      for (var index in supportedElements) {
        if (supportedElements.hasOwnProperty(index)) {
          if (supportedElements[index].checkSupport(element)) {
            // Create slide elements
            var sliderElement = document.createElement('div'),
              sliderElementContent = document.createElement('div')

            sliderElement.className = 'tobi__slider__slide'
            sliderElement.style.position = 'absolute'
            sliderElement.style.left = x * 100 + '%'
            sliderElementContent.className = 'tobi__slider__slide__content'

            if (config.draggable) {
              sliderElementContent.classList.add('draggable')
            }

            // Create type elements
            supportedElements[index].init(element, sliderElementContent)

            // Add slide content container to slider element
            sliderElement.appendChild(sliderElementContent)

            // Add slider element to slider
            slider.appendChild(sliderElement)
            sliderElements.push(sliderElement)

            ++x

            break
          }
        }
      }
    }

    /**
     * Open the lightbox
     *
     * @param {number} index - Index to load
     * @param {function} callback - Optional callback to call after open
     */
    var open = function open (index, callback) {
      if (!isOpen() && !index) {
        index = 0
      }

      if (isOpen()) {
        if (!index) {
          throw new Error('Ups, Tobi is aleady open.')
        }

        if (index === currentIndex) {
          throw new Error('Ups, slide ' + index + ' is already selected.')
        }
      }

      if (index === -1 || index >= elementsLength) {
        throw new Error('Ups, I can\'t find slide ' + index + '.')
      }

      if (!config.scroll) {
        document.documentElement.classList.add('tobi-is-open')
        document.body.classList.add('tobi-is-open')
      }

      // Hide buttons if necessary
      if (!config.nav || elementsLength === 1 || (config.nav === 'auto' && 'ontouchstart' in window)) {
        prevButton.setAttribute('aria-hidden', 'true')
        nextButton.setAttribute('aria-hidden', 'true')
      } else {
        prevButton.setAttribute('aria-hidden', 'false')
        nextButton.setAttribute('aria-hidden', 'false')
      }

      // Hide counter if necessary
      if (!config.counter || elementsLength === 1) {
        counter.setAttribute('aria-hidden', 'true')
      } else {
        counter.setAttribute('aria-hidden', 'false')
      }

      // Hide close if necessary
      if (!config.close) {
        closeButton.disabled = false
        closeButton.setAttribute('aria-hidden', 'true')
      }

      // Save the user’s focus
      lastFocus = document.activeElement

      // Set current index
      currentIndex = index

      // Clear drag
      clearDrag()

      // Bind events
      bindEvents()

      // Load slide
      load(currentIndex)

      // Makes lightbox appear, too
      lightbox.setAttribute('aria-hidden', 'false')

      // Update lightbox
      updateLightbox()

      // Preload late
      preload(currentIndex + 1)
      preload(currentIndex - 1)

      if (callback) {
        callback.call(this)
      }
    }

    /**
     * Close the lightbox
     *
     * @param {function} callback - Optional callback to call after close
     */
    var close = function close (callback) {
      if (!isOpen()) {
        throw new Error('Tobi is already closed.')
      }

      if (!config.scroll) {
        document.documentElement.classList.remove('tobi-is-open')
        document.body.classList.remove('tobi-is-open')
      }

      // Unbind events
      unbindEvents()

      // Reenable the user’s focus
      lastFocus.focus()

      // Don't forget to cleanup our current element
      var container = sliderElements[currentIndex].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')
      supportedElements[type].onLeave(container)
      supportedElements[type].onCleanup(container)

      lightbox.setAttribute('aria-hidden', 'true')

      // Reset current index
      currentIndex = 0

      if (callback) {
        callback.call(this)
      }
    }

    /**
     * Preload slide
     *
     * @param {number} index - Index to preload
     */
    var preload = function preload (index) {
      if (sliderElements[index] === undefined) {
        return
      }

      var container = sliderElements[index].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')

      supportedElements[type].onPreload(container)
    }

    /**
     * Load slide
     * Will be called when opening the lightbox or moving index
     *
     * @param {number} index - Index to load
     */
    var load = function load (index) {
      if (sliderElements[index] === undefined) {
        return
      }

      var container = sliderElements[index].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')

      supportedElements[type].onLoad(container)
    }

    /**
     * Navigate to the previous slide
     *
     * @param {function} callback - Optional callback function
     */
    var prev = function prev (callback) {
      if (currentIndex > 0) {
        leave(currentIndex)
        load(--currentIndex)
        updateLightbox('left')
        cleanup(currentIndex + 1)
        preload(currentIndex - 1)

        if (callback) {
          callback.call(this)
        }
      }
    }

    /**
     * Navigate to the next slide
     *
     * @param {function} callback - Optional callback function
     */
    var next = function next (callback) {
      if (currentIndex < elementsLength - 1) {
        leave(currentIndex)
        load(++currentIndex)
        updateLightbox('right')
        cleanup(currentIndex - 1)
        preload(currentIndex + 1)

        if (callback) {
          callback.call(this)
        }
      }
    }

    /**
     * Leave slide
     * Will be called before moving index
     *
     * @param {number} index - Index to leave
     */
    var leave = function leave (index) {
      if (sliderElements[index] === undefined) {
        return
      }

      var container = sliderElements[index].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')

      supportedElements[type].onLeave(container)
    }

    /**
     * Cleanup slide
     * Will be called after moving index
     *
     * @param {number} index - Index to cleanup
     */
    var cleanup = function cleanup (index) {
      if (sliderElements[index] === undefined) {
        return
      }

      var container = sliderElements[index].querySelector('.tobi__slider__slide__content')
      var type = container.getAttribute('data-type')

      supportedElements[type].onCleanup(container)
    }

    /**
     * Update the offset
     *
     */
    var updateOffset = function updateOffset () {
      offset = -currentIndex * window.innerWidth

      slider.style[transformProperty] = 'translate3d(' + offset + 'px, 0, 0)'
      offsetTmp = offset
    }

    /**
     * Update the counter
     *
     */
    var updateCounter = function updateCounter () {
      counter.textContent = (currentIndex + 1) + '/' + elementsLength
    }

    /**
     * Set the focus to the next element
     *
     * @param {string} dir - Current slide direction
     */
    var updateFocus = function updateFocus (dir) {
      var focusableEls = null

      if (config.nav) {
        // Display the next and previous buttons
        prevButton.disabled = false
        nextButton.disabled = false

        if (elementsLength === 1) {
          // Hide the next and previous buttons if there is only one slide
          prevButton.disabled = true
          nextButton.disabled = true

          if (config.close) {
            closeButton.focus()
          }
        } else if (currentIndex === 0) {
          // Hide the previous button when the first slide is displayed
          prevButton.disabled = true
        } else if (currentIndex === elementsLength - 1) {
          // Hide the next button when the last slide is displayed
          nextButton.disabled = true
        }

        if (!dir && !nextButton.disabled) {
          nextButton.focus()
        } else if (!dir && nextButton.disabled && !prevButton.disabled) {
          prevButton.focus()
        } else if (!nextButton.disabled && dir === 'right') {
          nextButton.focus()
        } else if (nextButton.disabled && dir === 'right' && !prevButton.disabled) {
          prevButton.focus()
        } else if (!prevButton.disabled && dir === 'left') {
          prevButton.focus()
        } else if (prevButton.disabled && dir === 'left' && !nextButton.disabled) {
          nextButton.focus()
        }
      } else if (config.close) {
        closeButton.focus()
      }

      focusableEls = lightbox.querySelectorAll('button:not(:disabled)')
      firstFocusableEl = focusableEls[0]
      lastFocusableEl = focusableEls.length === 1 ? focusableEls[0] : focusableEls[focusableEls.length - 1]
    }

    /**
     * Clear drag after touchend and mousup event
     *
     */
    var clearDrag = function clearDrag () {
      drag = {
        startX: 0,
        endX: 0,
        startY: 0,
        endY: 0
      }
    }

    /**
     * Recalculate drag / swipe event
     *
     */
    var updateAfterDrag = function updateAfterDrag () {
      var movementX = drag.endX - drag.startX,
        movementY = drag.endY - drag.startY,
        movementXDistance = Math.abs(movementX),
        movementYDistance = Math.abs(movementY)

      if (movementX > 0 && movementXDistance > config.threshold && currentIndex > 0) {
        prev()
      } else if (movementX < 0 && movementXDistance > config.threshold && currentIndex !== elementsLength - 1) {
        next()
      } else if (movementY < 0 && movementYDistance > config.threshold && config.swipeClose) {
        close()
      } else {
        updateOffset()
      }
    }

    /**
     * Click event handler
     *
     */
    var clickHandler = function clickHandler (event) {
      if (event.target === prevButton) {
        prev()
      } else if (event.target === nextButton) {
        next()
      } else if (event.target === closeButton || event.target.className === 'tobi__slider__slide') {
        close()
      }

      event.stopPropagation()
    }

    /**
     * Keydown event handler
     *
     */
    var keydownHandler = function keydownHandler (event) {
      if (event.keyCode === 9) {
        // `TAB` Key: Navigate to the next/previous focusable element
        if (event.shiftKey) {
          // Step backwards in the tab-order
          if (document.activeElement === firstFocusableEl) {
            lastFocusableEl.focus()
            event.preventDefault()
          }
        } else {
          // Step forward in the tab-order
          if (document.activeElement === lastFocusableEl) {
            firstFocusableEl.focus()
            event.preventDefault()
          }
        }
      } else if (event.keyCode === 27) {
        // `ESC` Key: Close the lightbox
        event.preventDefault()
        close()
      } else if (event.keyCode === 37) {
        // `PREV` Key: Navigate to the previous slide
        event.preventDefault()
        prev()
      } else if (event.keyCode === 39) {
        // `NEXT` Key: Navigate to the next slide
        event.preventDefault()
        next()
      }
    }

    /**
     * Touchstart event handler
     *
     */
    var touchstartHandler = function touchstartHandler (event) {
      // Prevent dragging / swiping on textareas inputs, selects and videos
      var ignoreElements = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT', 'VIDEO'].indexOf(event.target.nodeName) !== -1

      if (ignoreElements) {
        return
      }

      event.stopPropagation()

      pointerDown = true

      drag.startX = event.touches[0].pageX
      drag.startY = event.touches[0].pageY
    }

    /**
     * Touchmove event handler
     *
     */
    var touchmoveHandler = function touchmoveHandler (event) {
      event.stopPropagation()

      if (pointerDown) {
        event.preventDefault()

        drag.endX = event.touches[0].pageX
        drag.endY = event.touches[0].pageY

        slider.style[transformProperty] = 'translate3d(' + (offsetTmp - Math.round(drag.startX - drag.endX)) + 'px, 0, 0)'
      }
    }

    /**
     * Touchend event handler
     *
     */
    var touchendHandler = function touchendHandler (event) {
      event.stopPropagation()

      pointerDown = false

      if (drag.endX) {
        updateAfterDrag()
      }

      clearDrag()
    }

    /**
     * Mousedown event handler
     *
     */
    var mousedownHandler = function mousedownHandler (event) {
      // Prevent dragging / swiping on textareas inputs, selects and videos
      var ignoreElements = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT', 'VIDEO'].indexOf(event.target.nodeName) !== -1

      if (ignoreElements) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      pointerDown = true
      drag.startX = event.pageX
      drag.startY = event.pageY
    }

    /**
     * Mousemove event handler
     *
     */
    var mousemoveHandler = function mousemoveHandler (event) {
      event.preventDefault()

      if (pointerDown) {
        drag.endX = event.pageX
        drag.endY = event.pageY

        slider.style[transformProperty] = 'translate3d(' + (offsetTmp - Math.round(drag.startX - drag.endX)) + 'px, 0, 0)'
      }
    }

    /**
     * Mouseup event handler
     *
     */
    var mouseupHandler = function mouseupHandler (event) {
      event.stopPropagation()

      pointerDown = false

      if (drag.endX) {
        updateAfterDrag()
      }

      clearDrag()
    }

    /**
     * Bind events
     *
     */
    var bindEvents = function bindEvents () {
      if (config.keyboard) {
        document.addEventListener('keydown', keydownHandler)
      }

      // Click events
      if (config.docClose) {
        lightbox.addEventListener('click', clickHandler)
      }

      prevButton.addEventListener('click', clickHandler)
      nextButton.addEventListener('click', clickHandler)
      closeButton.addEventListener('click', clickHandler)

      if (config.draggable) {
        // Touch events
        lightbox.addEventListener('touchstart', touchstartHandler)
        lightbox.addEventListener('touchmove', touchmoveHandler)
        lightbox.addEventListener('touchend', touchendHandler)

        // Mouse events
        lightbox.addEventListener('mousedown', mousedownHandler)
        lightbox.addEventListener('mouseup', mouseupHandler)
        lightbox.addEventListener('mousemove', mousemoveHandler)
      }
    }

    /**
     * Unbind events
     *
     */
    var unbindEvents = function unbindEvents () {
      if (config.keyboard) {
        document.removeEventListener('keydown', keydownHandler)
      }

      // Click events
      if (config.docClose) {
        lightbox.removeEventListener('click', clickHandler)
      }

      prevButton.removeEventListener('click', clickHandler)
      nextButton.removeEventListener('click', clickHandler)
      closeButton.removeEventListener('click', clickHandler)

      if (config.draggable) {
        // Touch events
        lightbox.removeEventListener('touchstart', touchstartHandler)
        lightbox.removeEventListener('touchmove', touchmoveHandler)
        lightbox.removeEventListener('touchend', touchendHandler)

        // Mouse events
        lightbox.removeEventListener('mousedown', mousedownHandler)
        lightbox.removeEventListener('mouseup', mouseupHandler)
        lightbox.removeEventListener('mousemove', mousemoveHandler)
      }
    }

    /**
     * Checks whether element has requested data-type value
     *
     */
    var checkType = function checkType (element, type) {
      return element.getAttribute('data-type') === type
    }

    /**
     * Remove all `src` attributes
     *
     * @param {HTMLElement} element - Element to remove all `src` attributes
     */
    var removeSources = function setVideoSources (element) {
      var sources = element.querySelectorAll('src')

      if (sources) {
        Array.prototype.forEach.call(sources, function (source) {
          source.setAttribute('src', '')
        })
      }
    }

    /**
     * Update lightbox
     *
     * @param {string} dir - Current slide direction
     */
    var updateLightbox = function updateLightbox (dir) {
      updateOffset()
      updateCounter()
      updateFocus(dir)
    }

    /**
     * Reset the lightbox
     *
     * @param {function} callback - Optional callback to call after reset
     */
    var reset = function reset (callback) {
      if (slider) {
        while (slider.firstChild) {
          slider.removeChild(slider.firstChild)
        }
      }

      gallery.length = sliderElements.length = elementsLength = figcaptionId = x = 0

      if (callback) {
        callback.call(this)
      }
    }

    /**
     * Check if the lightbox is open
     *
     */
    var isOpen = function isOpen () {
      return lightbox.getAttribute('aria-hidden') === 'false'
    }

    /**
     * Return current index
     *
     */
    var currentSlide = function currentSlide () {
      return currentIndex
    }

    init(userOptions)

    return {
      open: open,
      prev: prev,
      next: next,
      close: close,
      add: add,
      reset: reset,
      isOpen: isOpen,
      currentSlide: currentSlide
    }
  }

  return Tobi
}))


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzY0YWQ1MThlY2Y3NmVlMzgxMmUiLCJ3ZWJwYWNrOi8vLy4vX3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JxcmF1aHZtcmFfX3RvYmkvanMvdG9iaS5qcyJdLCJuYW1lcyI6WyJ0b2JpIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUEyRDtBQUMzRDtBQUNBO0FBQ0EsV0FBRzs7QUFFSCxvREFBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3REFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBO0FBQ0Esb0NBQTRCO0FBQzVCLHFDQUE2QjtBQUM3Qix5Q0FBaUM7O0FBRWpDLCtDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBc0M7QUFDdEM7QUFDQTtBQUNBLHFDQUE2QjtBQUM3QixxQ0FBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQWlCLDhCQUE4QjtBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxnQkFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBYSx3Q0FBd0M7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBc0MsdUJBQXVCOztBQUU3RDtBQUNBOzs7Ozs7Ozs7O0FDbHRCQTs7QUFFQTs7Ozs7O0FBSEE7QUFJQSxJQUFNQSxPQUFPLGdDQUFiLEM7Ozs7OztBQ0pBLHlDOzs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsWUFBWTtBQUMzQixlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLE9BQU87O0FBRVA7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsWUFBWTtBQUMzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUMiLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG4gXHR2YXIgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2sgPSB3aW5kb3dbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0d2luZG93W1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0O1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdChyZXF1ZXN0VGltZW91dCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0cmVxdWVzdFRpbWVvdXQgPSByZXF1ZXN0VGltZW91dCB8fCAxMDAwMDtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRpZih0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTm8gYnJvd3NlciBzdXBwb3J0XCIpKTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0UGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiO1xyXG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSByZXF1ZXN0VGltZW91dDtcclxuIFx0XHRcdFx0cmVxdWVzdC5zZW5kKG51bGwpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnIpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3Quc3RhdHVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcclxuIFx0XHRcdFx0XHQvLyBubyB1cGRhdGUgYXZhaWxhYmxlXHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgIT09IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyAhPT0gMzA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdHZhciB1cGRhdGUgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuIFx0XHRcdFx0XHRcdHJlamVjdChlKTtcclxuIFx0XHRcdFx0XHRcdHJldHVybjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSh1cGRhdGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0XHJcbiBcdFxyXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XHJcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiYzY0YWQ1MThlY2Y3NmVlMzgxMmVcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcclxuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XHJcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRpZighbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xyXG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcclxuIFx0XHRcdGlmKG1lLmhvdC5hY3RpdmUpIHtcclxuIFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xyXG4gXHRcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA8IDApXHJcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA8IDApXHJcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcclxuIFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlcXVlc3QgKyBcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcclxuIFx0XHR9O1xyXG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fTtcclxuIFx0XHRmb3IodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKSB7XHJcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicmVhZHlcIilcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcclxuIFx0XHRcdFx0dGhyb3cgZXJyO1xyXG4gXHRcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xyXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XHJcbiBcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcclxuIFx0XHRcdFx0XHRpZighaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9O1xyXG4gXHRcdHJldHVybiBmbjtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaG90ID0ge1xyXG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxyXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcclxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXHJcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcclxuIFx0XHJcbiBcdFx0XHQvLyBNb2R1bGUgQVBJXHJcbiBcdFx0XHRhY3RpdmU6IHRydWUsXHJcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxyXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxyXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxyXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGlmKCFsKSByZXR1cm4gaG90U3RhdHVzO1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxyXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXHJcbiBcdFx0fTtcclxuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XHJcbiBcdFx0cmV0dXJuIGhvdDtcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XHJcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcclxuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcclxuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdERlZmVycmVkO1xyXG4gXHRcclxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXHJcbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XHJcbiBcdFx0dmFyIGlzTnVtYmVyID0gKCtpZCkgKyBcIlwiID09PSBpZDtcclxuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcclxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XHJcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XHJcbiBcdFx0XHRpZighdXBkYXRlKSB7XHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0XHRcdHJldHVybiBudWxsO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcclxuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcclxuIFx0XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcclxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcclxuIFx0XHRcdHZhciBjaHVua0lkID0gMDtcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxyXG4gXHRcdFx0cmV0dXJuO1xyXG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0aWYoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xyXG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XHJcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcclxuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcclxuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XHJcbiBcdFx0aWYoIWRlZmVycmVkKSByZXR1cm47XHJcbiBcdFx0aWYoaG90QXBwbHlPblVwZGF0ZSkge1xyXG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cclxuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxyXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxyXG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xyXG4gXHRcdFx0fSkudGhlbihcclxuIFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XHJcbiBcdFx0XHRcdGlmKCFjaGlsZCkgY29udGludWU7XHJcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcclxuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xyXG4gXHRcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcclxuIFx0XHJcbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRcdGlmKGNiKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xyXG4gXHRcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyciwgLy8gVE9ETyByZW1vdmUgaW4gd2VicGFjayA0XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvYXNzZXRzL1wiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDApKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGM2NGFkNTE4ZWNmNzZlZTM4MTJlIiwiLy8gQ1NTIGFuZCBTQVNTIGZpbGVzXG5pbXBvcnQgJy4vaW5kZXguc2Nzcyc7XG5cbmltcG9ydCBUb2JpIGZyb20gJ3JxcmF1aHZtcmFfX3RvYmknXG5jb25zdCB0b2JpID0gbmV3IFRvYmkoKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vX3NyYy9pbmRleC5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9fc3JjL2luZGV4LnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXHJcbiAqIFRvYmlcclxuICpcclxuICogQGF1dGhvciBycXJhdWh2bXJhXHJcbiAqIEB2ZXJzaW9uIDEuNy4zXHJcbiAqIEB1cmwgaHR0cHM6Ly9naXRodWIuY29tL3JxcmF1aHZtcmEvVG9iaVxyXG4gKlxyXG4gKiBNSVQgTGljZW5zZVxyXG4gKi9cclxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XHJcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxyXG4gICAgZGVmaW5lKGZhY3RvcnkpXHJcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XHJcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcclxuICAgIC8vIGxpa2UgTm9kZS5cclxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpXHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXHJcbiAgICByb290LlRvYmkgPSBmYWN0b3J5KClcclxuICB9XHJcbn0odGhpcywgZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0J1xyXG5cclxuICB2YXIgVG9iaSA9IGZ1bmN0aW9uIFRvYmkgKHVzZXJPcHRpb25zKSB7XHJcbiAgICAvKipcclxuICAgICAqIEdsb2JhbCB2YXJpYWJsZXNcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBjb25maWcgPSB7fSxcclxuICAgICAgYnJvd3NlcldpbmRvdyA9IHdpbmRvdyxcclxuICAgICAgdHJhbnNmb3JtUHJvcGVydHkgPSBudWxsLFxyXG4gICAgICBnYWxsZXJ5ID0gW10sXHJcbiAgICAgIGZpZ2NhcHRpb25JZCA9IDAsXHJcbiAgICAgIGVsZW1lbnRzTGVuZ3RoID0gMCxcclxuICAgICAgbGlnaHRib3ggPSBudWxsLFxyXG4gICAgICBzbGlkZXIgPSBudWxsLFxyXG4gICAgICBzbGlkZXJFbGVtZW50cyA9IFtdLFxyXG4gICAgICBwcmV2QnV0dG9uID0gbnVsbCxcclxuICAgICAgbmV4dEJ1dHRvbiA9IG51bGwsXHJcbiAgICAgIGNsb3NlQnV0dG9uID0gbnVsbCxcclxuICAgICAgY291bnRlciA9IG51bGwsXHJcbiAgICAgIGN1cnJlbnRJbmRleCA9IDAsXHJcbiAgICAgIGRyYWcgPSB7fSxcclxuICAgICAgcG9pbnRlckRvd24gPSBmYWxzZSxcclxuICAgICAgbGFzdEZvY3VzID0gbnVsbCxcclxuICAgICAgZmlyc3RGb2N1c2FibGVFbCA9IG51bGwsXHJcbiAgICAgIGxhc3RGb2N1c2FibGVFbCA9IG51bGwsXHJcbiAgICAgIG9mZnNldCA9IG51bGwsXHJcbiAgICAgIG9mZnNldFRtcCA9IG51bGwsXHJcbiAgICAgIHJlc2l6ZVRpY2tpbmcgPSBmYWxzZSxcclxuICAgICAgeCA9IDBcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1lcmdlIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHVzZXIgb3B0aW9uc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB1c2VyT3B0aW9ucyAtIE9wdGlvbmFsIHVzZXIgb3B0aW9uc1xyXG4gICAgICogQHJldHVybnMge09iamVjdH0gLSBDdXN0b20gb3B0aW9uc1xyXG4gICAgICovXHJcbiAgICB2YXIgbWVyZ2VPcHRpb25zID0gZnVuY3Rpb24gbWVyZ2VPcHRpb25zICh1c2VyT3B0aW9ucykge1xyXG4gICAgICAvLyBEZWZhdWx0IG9wdGlvbnNcclxuICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgc2VsZWN0b3I6ICcubGlnaHRib3gnLFxyXG4gICAgICAgIGNhcHRpb25zOiB0cnVlLFxyXG4gICAgICAgIGNhcHRpb25zU2VsZWN0b3I6ICdpbWcnLFxyXG4gICAgICAgIGNhcHRpb25BdHRyaWJ1dGU6ICdhbHQnLFxyXG4gICAgICAgIG5hdjogJ2F1dG8nLFxyXG4gICAgICAgIG5hdlRleHQ6IFsnPHN2ZyByb2xlPVwiaW1nXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdib3g9XCIwIDAgMjQgMjRcIj48cG9seWxpbmUgcG9pbnRzPVwiMTQgMTggOCAxMiAxNCA2IDE0IDZcIj48L3BvbHlsaW5lPjwvc3ZnPicsICc8c3ZnIHJvbGU9XCJpbWdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld2JveD1cIjAgMCAyNCAyNFwiPjxwb2x5bGluZSBwb2ludHM9XCIxMCA2IDE2IDEyIDEwIDE4IDEwIDE4XCI+PC9wb2x5bGluZT48L3N2Zz4nXSxcclxuICAgICAgICBuYXZMYWJlbDogWydQcmV2aW91cycsICdOZXh0J10sXHJcbiAgICAgICAgY2xvc2U6IHRydWUsXHJcbiAgICAgICAgY2xvc2VUZXh0OiAnPHN2ZyByb2xlPVwiaW1nXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiIHZpZXdib3g9XCIwIDAgMjQgMjRcIj48cGF0aCBkPVwiTTYuMzQzMTQ1NzUgNi4zNDMxNDU3NUwxNy42NTY4NTQyIDE3LjY1Njg1NDJNNi4zNDMxNDU3NSAxNy42NTY4NTQyTDE3LjY1Njg1NDIgNi4zNDMxNDU3NVwiPjwvcGF0aD48L3N2Zz4nLFxyXG4gICAgICAgIGNsb3NlTGFiZWw6ICdDbG9zZScsXHJcbiAgICAgICAgY291bnRlcjogdHJ1ZSxcclxuICAgICAgICBkb3dubG9hZDogZmFsc2UsIC8vIFRPRE9cclxuICAgICAgICBkb3dubG9hZFRleHQ6ICcnLCAvLyBUT0RPXHJcbiAgICAgICAgZG93bmxvYWRMYWJlbDogJ0Rvd25sb2FkJywgLy8gVE9ET1xyXG4gICAgICAgIGtleWJvYXJkOiB0cnVlLFxyXG4gICAgICAgIHpvb206IHRydWUsXHJcbiAgICAgICAgem9vbVRleHQ6ICc8c3ZnIHJvbGU9XCJpbWdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiPjxwYXRoIGQ9XCJNNCwyMCBMOS41ODc4ODc3OCwxNC40MTIxMTIyXCI+PC9wYXRoPjxwYXRoIGQ9XCJNMTQsMTYgQzEwLjY4NjI5MTUsMTYgOCwxMy4zMTM3MDg1IDgsMTAgQzgsNi42ODYyOTE1IDEwLjY4NjI5MTUsNCAxNCw0IEMxNy4zMTM3MDg1LDQgMjAsNi42ODYyOTE1IDIwLDEwIEMyMCwxMy4zMTM3MDg1IDE3LjMxMzcwODUsMTYgMTQsMTYgWlwiPjwvcGF0aD48cGF0aCBkPVwiTTE2LjY2NjY2NjcgMTBMMTEuMzMzMzMzMyAxME0xNCA3LjMzMzMzMzMzTDE0IDEyLjY2NjY2NjdcIj48L3BhdGg+PC9zdmc+JyxcclxuICAgICAgICBkb2NDbG9zZTogdHJ1ZSxcclxuICAgICAgICBzd2lwZUNsb3NlOiB0cnVlLFxyXG4gICAgICAgIHNjcm9sbDogZmFsc2UsXHJcbiAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICAgIHRocmVzaG9sZDogMTAwLFxyXG4gICAgICAgIHJ0bDogZmFsc2UsIC8vIFRPRE9cclxuICAgICAgICBsb29wOiBmYWxzZSwgLy8gVE9ET1xyXG4gICAgICAgIGF1dG9wbGF5VmlkZW86IGZhbHNlXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh1c2VyT3B0aW9ucykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKHVzZXJPcHRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgIG9wdGlvbnNba2V5XSA9IHVzZXJPcHRpb25zW2tleV1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gb3B0aW9uc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZXJtaW5lIGlmIGJyb3dzZXIgc3VwcG9ydHMgdW5wcmVmaXhlZCB0cmFuc2Zvcm0gcHJvcGVydHlcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIFRyYW5zZm9ybSBwcm9wZXJ0eSBzdXBwb3J0ZWQgYnkgY2xpZW50XHJcbiAgICAgKi9cclxuICAgIHZhciB0cmFuc2Zvcm1TdXBwb3J0ID0gZnVuY3Rpb24gdHJhbnNmb3JtU3VwcG9ydCAoKSB7XHJcbiAgICAgIHJldHVybiB0eXBlb2YgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9PT0gJ3N0cmluZycgPyAndHJhbnNmb3JtJyA6ICdXZWJraXRUcmFuc2Zvcm0nXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUeXBlcyAtIHlvdSBjYW4gYWRkIG5ldyB0eXBlIHRvIHN1cHBvcnQgc29tZXRoaW5nIG5ld1xyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIHN1cHBvcnRlZEVsZW1lbnRzID0ge1xyXG4gICAgICBpbWFnZToge1xyXG4gICAgICAgIGNoZWNrU3VwcG9ydDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgIHJldHVybiAhZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpICYmIGVsZW1lbnQuaHJlZi5tYXRjaCgvXFwuKHBuZ3xqcGU/Z3x0aWZmfHRpZnxnaWZ8Ym1wfHdlYnB8c3ZnfGljbykkLylcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgICB2YXIgZmlndXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmlndXJlJyksXHJcbiAgICAgICAgICAgIGZpZ2NhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmaWdjYXB0aW9uJyksXHJcbiAgICAgICAgICAgIGltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyksXHJcbiAgICAgICAgICAgIHRodW1ibmFpbCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignaW1nJyksXHJcbiAgICAgICAgICAgIGxvYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcblxyXG4gICAgICAgICAgaW1hZ2Uuc3R5bGUub3BhY2l0eSA9ICcwJ1xyXG5cclxuICAgICAgICAgIGlmICh0aHVtYm5haWwpIHtcclxuICAgICAgICAgICAgaW1hZ2UuYWx0ID0gdGh1bWJuYWlsLmFsdCB8fCAnJ1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZSgnc3JjJywgJycpXHJcbiAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJywgZWxlbWVudC5ocmVmKVxyXG5cclxuICAgICAgICAgIC8vIEFkZCBpbWFnZSB0byBmaWd1cmVcclxuICAgICAgICAgIGZpZ3VyZS5hcHBlbmRDaGlsZChpbWFnZSlcclxuXHJcbiAgICAgICAgICAvLyBDcmVhdGUgZmlnY2FwdGlvblxyXG4gICAgICAgICAgaWYgKGNvbmZpZy5jYXB0aW9ucykge1xyXG4gICAgICAgICAgICBmaWdjYXB0aW9uLnN0eWxlLm9wYWNpdHkgPSAnMCdcclxuXHJcbiAgICAgICAgICAgIGlmIChjb25maWcuY2FwdGlvbnNTZWxlY3RvciA9PT0gJ3NlbGYnICYmIGVsZW1lbnQuZ2V0QXR0cmlidXRlKGNvbmZpZy5jYXB0aW9uQXR0cmlidXRlKSkge1xyXG4gICAgICAgICAgICAgIGZpZ2NhcHRpb24udGV4dENvbnRlbnQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShjb25maWcuY2FwdGlvbkF0dHJpYnV0ZSlcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcuY2FwdGlvbnNTZWxlY3RvciA9PT0gJ2ltZycgJiYgdGh1bWJuYWlsICYmIHRodW1ibmFpbC5nZXRBdHRyaWJ1dGUoY29uZmlnLmNhcHRpb25BdHRyaWJ1dGUpKSB7XHJcbiAgICAgICAgICAgICAgZmlnY2FwdGlvbi50ZXh0Q29udGVudCA9IHRodW1ibmFpbC5nZXRBdHRyaWJ1dGUoY29uZmlnLmNhcHRpb25BdHRyaWJ1dGUpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChmaWdjYXB0aW9uLnRleHRDb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgZmlnY2FwdGlvbi5pZCA9ICd0b2JpLWZpZ2NhcHRpb24tJyArIGZpZ2NhcHRpb25JZFxyXG4gICAgICAgICAgICAgIGZpZ3VyZS5hcHBlbmRDaGlsZChmaWdjYXB0aW9uKVxyXG5cclxuICAgICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScsIGZpZ2NhcHRpb24uaWQpXHJcblxyXG4gICAgICAgICAgICAgICsrZmlnY2FwdGlvbklkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBBZGQgZmlndXJlIHRvIGNvbnRhaW5lclxyXG4gICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGZpZ3VyZSlcclxuXHJcbiAgICAgICAgICAvLyAgQ3JlYXRlIGxvYWRlclxyXG4gICAgICAgICAgbG9hZGVyLmNsYXNzTmFtZSA9ICd0b2JpLWxvYWRlcidcclxuXHJcbiAgICAgICAgICAvLyBBZGQgbG9hZGVyIHRvIGNvbnRhaW5lclxyXG4gICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxvYWRlcilcclxuXHJcbiAgICAgICAgICAvLyBSZWdpc3RlciB0eXBlXHJcbiAgICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnLCAnaW1hZ2UnKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uUHJlbG9hZDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgLy8gU2FtZSBhcyBwcmVsb2FkXHJcbiAgICAgICAgICBzdXBwb3J0ZWRFbGVtZW50cy5pbWFnZS5vbkxvYWQoY29udGFpbmVyKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uTG9hZDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdmFyIGltYWdlID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpXHJcblxyXG4gICAgICAgICAgaWYgKCFpbWFnZS5oYXNBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdmFyIGZpZ2NhcHRpb24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignZmlnY2FwdGlvbicpLFxyXG4gICAgICAgICAgICBsb2FkZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnRvYmktbG9hZGVyJylcclxuXHJcbiAgICAgICAgICBpbWFnZS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChsb2FkZXIpXHJcbiAgICAgICAgICAgIGltYWdlLnN0eWxlLm9wYWNpdHkgPSAnMSdcclxuXHJcbiAgICAgICAgICAgIGlmIChmaWdjYXB0aW9uKSB7XHJcbiAgICAgICAgICAgICAgZmlnY2FwdGlvbi5zdHlsZS5vcGFjaXR5ID0gJzEnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGltYWdlLmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSlcclxuICAgICAgICAgIGltYWdlLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1zcmMnKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uTGVhdmU6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIE5vdGhpbmdcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvbkNsZWFudXA6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIE5vdGhpbmdcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB5b3V0dWJlOiB7XHJcbiAgICAgICAgY2hlY2tTdXBwb3J0OiBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgcmV0dXJuIGNoZWNrVHlwZShlbGVtZW50LCAneW91dHViZScpXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQsIGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uUHJlbG9hZDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgLy8gTm90aGluZ1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uTG9hZDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uTGVhdmU6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvbkNsZWFudXA6IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgICAgICAgIC8vIE5vdGhpbmdcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBpZnJhbWU6IHtcclxuICAgICAgICBjaGVja1N1cHBvcnQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICByZXR1cm4gY2hlY2tUeXBlKGVsZW1lbnQsICdpZnJhbWUnKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50LCBjb250YWluZXIpIHtcclxuICAgICAgICAgIHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKSxcclxuICAgICAgICAgICAgaHJlZiA9IGVsZW1lbnQuaGFzQXR0cmlidXRlKCdocmVmJykgPyBlbGVtZW50LmdldEF0dHJpYnV0ZSgnaHJlZicpIDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGFyZ2V0JylcclxuXHJcbiAgICAgICAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdmcmFtZWJvcmRlcicsICcwJylcclxuICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcnKVxyXG4gICAgICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgnZGF0YS1zcmMnLCBocmVmKVxyXG5cclxuICAgICAgICAgIC8vIEFkZCBpZnJhbWUgdG8gY29udGFpbmVyXHJcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoaWZyYW1lKVxyXG5cclxuICAgICAgICAgIC8vIFJlZ2lzdGVyIHR5cGVcclxuICAgICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScsICdpZnJhbWUnKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uUHJlbG9hZDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgLy8gTm90aGluZ1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uTG9hZDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdmFyIGlmcmFtZSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpZnJhbWUnKVxyXG5cclxuICAgICAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGlmcmFtZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykpXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25MZWF2ZTogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgLy8gTm90aGluZ1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uQ2xlYW51cDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgLy8gTm90aGluZ1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGh0bWw6IHtcclxuICAgICAgICBjaGVja1N1cHBvcnQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgICByZXR1cm4gY2hlY2tUeXBlKGVsZW1lbnQsICdodG1sJylcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoZWxlbWVudCwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgICB2YXIgdGFyZ2V0U2VsZWN0b3IgPSBlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnaHJlZicpID8gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSA6IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRhcmdldCcpLFxyXG4gICAgICAgICAgICB0YXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldFNlbGVjdG9yKVxyXG5cclxuICAgICAgICAgIGlmICghdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVXBzLCBJIGNhblxcJ3QgZmluZCB0aGUgdGFyZ2V0ICcgKyB0YXJnZXRTZWxlY3RvciArICcuJylcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBBZGQgY29udGVudCB0byBjb250YWluZXJcclxuICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0YXJnZXQpXHJcblxyXG4gICAgICAgICAgLy8gUmVnaXN0ZXIgdHlwZVxyXG4gICAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS10eXBlJywgJ2h0bWwnKVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uUHJlbG9hZDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgLy8gTm90aGluZ1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9uTG9hZDogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdmFyIHZpZGVvID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJylcclxuXHJcbiAgICAgICAgICBpZiAodmlkZW8pIHtcclxuICAgICAgICAgICAgaWYgKHZpZGVvLmhhc0F0dHJpYnV0ZSgnZGF0YS10aW1lJykgJiYgdmlkZW8ucmVhZHlTdGF0ZSA+IDApIHtcclxuICAgICAgICAgICAgICAvLyBDb250aW51ZSB3aGVyZSB2aWRlbyB3YXMgc3RvcHBlZFxyXG4gICAgICAgICAgICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gdmlkZW8uZ2V0QXR0cmlidXRlKCdkYXRhLXRpbWUnKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY29uZmlnLmF1dG9wbGF5VmlkZW8pIHtcclxuICAgICAgICAgICAgICAvLyBTdGFydCBwbGF5YmFjayAoYW5kIGxvYWRpbmcgaWYgbmVjZXNzYXJ5KVxyXG4gICAgICAgICAgICAgIHZpZGVvLnBsYXkoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25MZWF2ZTogZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgdmFyIHZpZGVvID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJylcclxuXHJcbiAgICAgICAgICBpZiAodmlkZW8pIHtcclxuICAgICAgICAgICAgaWYgKCF2aWRlby5wYXVzZWQpIHtcclxuICAgICAgICAgICAgICAvLyBTdG9wIGlmIHZpZGVvIGlzIHBsYXlpbmdcclxuICAgICAgICAgICAgICB2aWRlby5wYXVzZSgpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEJhY2t1cCBjdXJyZW50VGltZSAobmVlZGVkIGZvciByZXZpc2l0KVxyXG4gICAgICAgICAgICBpZiAodmlkZW8ucmVhZHlTdGF0ZSA+IDApIHtcclxuICAgICAgICAgICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGltZScsIHZpZGVvLmN1cnJlbnRUaW1lKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25DbGVhbnVwOiBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICB2YXIgdmlkZW8gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcigndmlkZW8nKVxyXG5cclxuICAgICAgICAgIGlmICh2aWRlbykge1xyXG4gICAgICAgICAgICBpZiAodmlkZW8ucmVhZHlTdGF0ZSA+IDAgJiYgdmlkZW8ucmVhZHlTdGF0ZSA8IDMgJiYgdmlkZW8uZHVyYXRpb24gIT09IHZpZGVvLmN1cnJlbnRUaW1lKSB7XHJcbiAgICAgICAgICAgICAgLy8gU29tZSBkYXRhIGhhcyBiZWVuIGxvYWRlZCBidXQgbm90IHRoZSB3aG9sZSBwYWNrYWdlLlxyXG4gICAgICAgICAgICAgIC8vIEluIG9yZGVyIHRvIHNhdmUgYmFuZHdpZHRoLCBzdG9wIGRvd25sb2FkaW5nIGFzIHNvb24gYXMgcG9zc2libGUuXHJcbiAgICAgICAgICAgICAgdmFyIGNsb25lID0gdmlkZW8uY2xvbmVOb2RlKHRydWUpXHJcblxyXG4gICAgICAgICAgICAgIHJlbW92ZVNvdXJjZXModmlkZW8pXHJcbiAgICAgICAgICAgICAgdmlkZW8ubG9hZCgpXHJcblxyXG4gICAgICAgICAgICAgIHZpZGVvLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodmlkZW8pXHJcblxyXG4gICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjbG9uZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdFxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiBpbml0ICh1c2VyT3B0aW9ucykge1xyXG4gICAgICAvLyBNZXJnZSB1c2VyIG9wdGlvbnMgaW50byBkZWZhdWx0c1xyXG4gICAgICBjb25maWcgPSBtZXJnZU9wdGlvbnModXNlck9wdGlvbnMpXHJcblxyXG4gICAgICAvLyBUcmFuc2Zvcm0gcHJvcGVydHkgc3VwcG9ydGVkIGJ5IGNsaWVudFxyXG4gICAgICB0cmFuc2Zvcm1Qcm9wZXJ0eSA9IHRyYW5zZm9ybVN1cHBvcnQoKVxyXG5cclxuICAgICAgLy8gR2V0IGEgbGlzdCBvZiBhbGwgZWxlbWVudHMgd2l0aGluIHRoZSBkb2N1bWVudFxyXG4gICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGNvbmZpZy5zZWxlY3RvcilcclxuXHJcbiAgICAgIGlmICghZWxlbWVudHMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VwcywgSSBjYW5cXCd0IGZpbmQgdGhlIHNlbGVjdG9yICcgKyBjb25maWcuc2VsZWN0b3IgKyAnLicpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEV4ZWN1dGUgYSBmZXcgdGhpbmdzIG9uY2UgcGVyIGVsZW1lbnRcclxuICAgICAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChlbGVtZW50cywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICBhZGQoZWxlbWVudClcclxuICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBlbGVtZW50XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIEVsZW1lbnQgdG8gYWRkXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIE9wdGlvbmFsIGNhbGxiYWNrIHRvIGNhbGwgYWZ0ZXIgYWRkXHJcbiAgICAgKi9cclxuICAgIHZhciBhZGQgPSBmdW5jdGlvbiBhZGQgKGVsZW1lbnQsIGNhbGxiYWNrKSB7XHJcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBsaWdodGJveCBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICBpZiAoIWxpZ2h0Ym94KSB7XHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBsaWdodGJveFxyXG4gICAgICAgIGNyZWF0ZUxpZ2h0Ym94KClcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICBpZiAoZ2FsbGVyeS5pbmRleE9mKGVsZW1lbnQpID09PSAtMSkge1xyXG4gICAgICAgIGdhbGxlcnkucHVzaChlbGVtZW50KVxyXG4gICAgICAgIGVsZW1lbnRzTGVuZ3RoKytcclxuXHJcbiAgICAgICAgLy8gU2V0IHpvb20gaWNvbiBpZiBuZWNlc3NhcnlcclxuICAgICAgICBpZiAoY29uZmlnLnpvb20gJiYgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpbWcnKSkge1xyXG4gICAgICAgICAgdmFyIHRvYmlab29tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuXHJcbiAgICAgICAgICB0b2JpWm9vbS5jbGFzc05hbWUgPSAndG9iaS16b29tX19pY29uJ1xyXG4gICAgICAgICAgdG9iaVpvb20uaW5uZXJIVE1MID0gY29uZmlnLnpvb21UZXh0XHJcblxyXG4gICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0b2JpLXpvb20nKVxyXG4gICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0b2JpWm9vbSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEJpbmQgY2xpY2sgZXZlbnQgaGFuZGxlclxyXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICAgICAgICBvcGVuKGdhbGxlcnkuaW5kZXhPZih0aGlzKSlcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBDcmVhdGUgdGhlIHNsaWRlXHJcbiAgICAgICAgY3JlYXRlTGlnaHRib3hTbGlkZShlbGVtZW50KVxyXG5cclxuICAgICAgICBpZiAoaXNPcGVuKCkpIHtcclxuICAgICAgICAgIHVwZGF0ZUxpZ2h0Ym94KClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VwcywgZWxlbWVudCBhbHJlYWR5IGFkZGVkIHRvIHRoZSBsaWdodGJveC4nKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdGhlIGxpZ2h0Ym94XHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgY3JlYXRlTGlnaHRib3ggPSBmdW5jdGlvbiBjcmVhdGVMaWdodGJveCAoKSB7XHJcbiAgICAgIC8vIENyZWF0ZSBsaWdodGJveCBjb250YWluZXJcclxuICAgICAgbGlnaHRib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICBsaWdodGJveC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZGlhbG9nJylcclxuICAgICAgbGlnaHRib3guc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcclxuICAgICAgbGlnaHRib3guY2xhc3NOYW1lID0gJ3RvYmknXHJcblxyXG4gICAgICAvLyBDcmVhdGUgc2xpZGVyIGNvbnRhaW5lclxyXG4gICAgICBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICBzbGlkZXIuY2xhc3NOYW1lID0gJ3RvYmlfX3NsaWRlcidcclxuICAgICAgbGlnaHRib3guYXBwZW5kQ2hpbGQoc2xpZGVyKVxyXG5cclxuICAgICAgLy8gQ3JlYXRlIHByZXZpb3VzIGJ1dHRvblxyXG4gICAgICBwcmV2QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcclxuICAgICAgcHJldkJ1dHRvbi5jbGFzc05hbWUgPSAndG9iaV9fcHJldidcclxuICAgICAgcHJldkJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJylcclxuICAgICAgcHJldkJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBjb25maWcubmF2TGFiZWxbMF0pXHJcbiAgICAgIHByZXZCdXR0b24uaW5uZXJIVE1MID0gY29uZmlnLm5hdlRleHRbMF1cclxuICAgICAgbGlnaHRib3guYXBwZW5kQ2hpbGQocHJldkJ1dHRvbilcclxuXHJcbiAgICAgIC8vIENyZWF0ZSBuZXh0IGJ1dHRvblxyXG4gICAgICBuZXh0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcclxuICAgICAgbmV4dEJ1dHRvbi5jbGFzc05hbWUgPSAndG9iaV9fbmV4dCdcclxuICAgICAgbmV4dEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJylcclxuICAgICAgbmV4dEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBjb25maWcubmF2TGFiZWxbMV0pXHJcbiAgICAgIG5leHRCdXR0b24uaW5uZXJIVE1MID0gY29uZmlnLm5hdlRleHRbMV1cclxuICAgICAgbGlnaHRib3guYXBwZW5kQ2hpbGQobmV4dEJ1dHRvbilcclxuXHJcbiAgICAgIC8vIENyZWF0ZSBjbG9zZSBidXR0b25cclxuICAgICAgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKVxyXG4gICAgICBjbG9zZUJ1dHRvbi5jbGFzc05hbWUgPSAndG9iaV9fY2xvc2UnXHJcbiAgICAgIGNsb3NlQnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKVxyXG4gICAgICBjbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBjb25maWcuY2xvc2VMYWJlbClcclxuICAgICAgY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gY29uZmlnLmNsb3NlVGV4dFxyXG4gICAgICBsaWdodGJveC5hcHBlbmRDaGlsZChjbG9zZUJ1dHRvbilcclxuXHJcbiAgICAgIC8vIENyZWF0ZSBjb3VudGVyXHJcbiAgICAgIGNvdW50ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICBjb3VudGVyLmNsYXNzTmFtZSA9ICd0b2JpX19jb3VudGVyJ1xyXG4gICAgICBsaWdodGJveC5hcHBlbmRDaGlsZChjb3VudGVyKVxyXG5cclxuICAgICAgLy8gUmVzaXplIGV2ZW50IHVzaW5nIHJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgICBicm93c2VyV2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXJlc2l6ZVRpY2tpbmcpIHtcclxuICAgICAgICAgIHJlc2l6ZVRpY2tpbmcgPSB0cnVlXHJcbiAgICAgICAgICBicm93c2VyV2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHVwZGF0ZU9mZnNldCgpXHJcbiAgICAgICAgICAgIHJlc2l6ZVRpY2tpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxpZ2h0Ym94KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgbGlnaHRib3ggc2xpZGVcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBjcmVhdGVMaWdodGJveFNsaWRlID0gZnVuY3Rpb24gY3JlYXRlTGlnaHRib3hTbGlkZSAoZWxlbWVudCkge1xyXG4gICAgICAvLyBEZXRlY3QgdHlwZVxyXG4gICAgICBmb3IgKHZhciBpbmRleCBpbiBzdXBwb3J0ZWRFbGVtZW50cykge1xyXG4gICAgICAgIGlmIChzdXBwb3J0ZWRFbGVtZW50cy5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcclxuICAgICAgICAgIGlmIChzdXBwb3J0ZWRFbGVtZW50c1tpbmRleF0uY2hlY2tTdXBwb3J0KGVsZW1lbnQpKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBzbGlkZSBlbGVtZW50c1xyXG4gICAgICAgICAgICB2YXIgc2xpZGVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG4gICAgICAgICAgICAgIHNsaWRlckVsZW1lbnRDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuXHJcbiAgICAgICAgICAgIHNsaWRlckVsZW1lbnQuY2xhc3NOYW1lID0gJ3RvYmlfX3NsaWRlcl9fc2xpZGUnXHJcbiAgICAgICAgICAgIHNsaWRlckVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXHJcbiAgICAgICAgICAgIHNsaWRlckVsZW1lbnQuc3R5bGUubGVmdCA9IHggKiAxMDAgKyAnJSdcclxuICAgICAgICAgICAgc2xpZGVyRWxlbWVudENvbnRlbnQuY2xhc3NOYW1lID0gJ3RvYmlfX3NsaWRlcl9fc2xpZGVfX2NvbnRlbnQnXHJcblxyXG4gICAgICAgICAgICBpZiAoY29uZmlnLmRyYWdnYWJsZSkge1xyXG4gICAgICAgICAgICAgIHNsaWRlckVsZW1lbnRDb250ZW50LmNsYXNzTGlzdC5hZGQoJ2RyYWdnYWJsZScpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSB0eXBlIGVsZW1lbnRzXHJcbiAgICAgICAgICAgIHN1cHBvcnRlZEVsZW1lbnRzW2luZGV4XS5pbml0KGVsZW1lbnQsIHNsaWRlckVsZW1lbnRDb250ZW50KVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHNsaWRlIGNvbnRlbnQgY29udGFpbmVyIHRvIHNsaWRlciBlbGVtZW50XHJcbiAgICAgICAgICAgIHNsaWRlckVsZW1lbnQuYXBwZW5kQ2hpbGQoc2xpZGVyRWxlbWVudENvbnRlbnQpXHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgc2xpZGVyIGVsZW1lbnQgdG8gc2xpZGVyXHJcbiAgICAgICAgICAgIHNsaWRlci5hcHBlbmRDaGlsZChzbGlkZXJFbGVtZW50KVxyXG4gICAgICAgICAgICBzbGlkZXJFbGVtZW50cy5wdXNoKHNsaWRlckVsZW1lbnQpXHJcblxyXG4gICAgICAgICAgICArK3hcclxuXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPcGVuIHRoZSBsaWdodGJveFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIEluZGV4IHRvIGxvYWRcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gT3B0aW9uYWwgY2FsbGJhY2sgdG8gY2FsbCBhZnRlciBvcGVuXHJcbiAgICAgKi9cclxuICAgIHZhciBvcGVuID0gZnVuY3Rpb24gb3BlbiAoaW5kZXgsIGNhbGxiYWNrKSB7XHJcbiAgICAgIGlmICghaXNPcGVuKCkgJiYgIWluZGV4KSB7XHJcbiAgICAgICAgaW5kZXggPSAwXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpc09wZW4oKSkge1xyXG4gICAgICAgIGlmICghaW5kZXgpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVXBzLCBUb2JpIGlzIGFsZWFkeSBvcGVuLicpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW5kZXggPT09IGN1cnJlbnRJbmRleCkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVcHMsIHNsaWRlICcgKyBpbmRleCArICcgaXMgYWxyZWFkeSBzZWxlY3RlZC4nKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGluZGV4ID09PSAtMSB8fCBpbmRleCA+PSBlbGVtZW50c0xlbmd0aCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVXBzLCBJIGNhblxcJ3QgZmluZCBzbGlkZSAnICsgaW5kZXggKyAnLicpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghY29uZmlnLnNjcm9sbCkge1xyXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0b2JpLWlzLW9wZW4nKVxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgndG9iaS1pcy1vcGVuJylcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSGlkZSBidXR0b25zIGlmIG5lY2Vzc2FyeVxyXG4gICAgICBpZiAoIWNvbmZpZy5uYXYgfHwgZWxlbWVudHNMZW5ndGggPT09IDEgfHwgKGNvbmZpZy5uYXYgPT09ICdhdXRvJyAmJiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpKSB7XHJcbiAgICAgICAgcHJldkJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxyXG4gICAgICAgIG5leHRCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwcmV2QnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKVxyXG4gICAgICAgIG5leHRCdXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEhpZGUgY291bnRlciBpZiBuZWNlc3NhcnlcclxuICAgICAgaWYgKCFjb25maWcuY291bnRlciB8fCBlbGVtZW50c0xlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIGNvdW50ZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb3VudGVyLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnZmFsc2UnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBIaWRlIGNsb3NlIGlmIG5lY2Vzc2FyeVxyXG4gICAgICBpZiAoIWNvbmZpZy5jbG9zZSkge1xyXG4gICAgICAgIGNsb3NlQnV0dG9uLmRpc2FibGVkID0gZmFsc2VcclxuICAgICAgICBjbG9zZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTYXZlIHRoZSB1c2Vy4oCZcyBmb2N1c1xyXG4gICAgICBsYXN0Rm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XHJcblxyXG4gICAgICAvLyBTZXQgY3VycmVudCBpbmRleFxyXG4gICAgICBjdXJyZW50SW5kZXggPSBpbmRleFxyXG5cclxuICAgICAgLy8gQ2xlYXIgZHJhZ1xyXG4gICAgICBjbGVhckRyYWcoKVxyXG5cclxuICAgICAgLy8gQmluZCBldmVudHNcclxuICAgICAgYmluZEV2ZW50cygpXHJcblxyXG4gICAgICAvLyBMb2FkIHNsaWRlXHJcbiAgICAgIGxvYWQoY3VycmVudEluZGV4KVxyXG5cclxuICAgICAgLy8gTWFrZXMgbGlnaHRib3ggYXBwZWFyLCB0b29cclxuICAgICAgbGlnaHRib3guc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICdmYWxzZScpXHJcblxyXG4gICAgICAvLyBVcGRhdGUgbGlnaHRib3hcclxuICAgICAgdXBkYXRlTGlnaHRib3goKVxyXG5cclxuICAgICAgLy8gUHJlbG9hZCBsYXRlXHJcbiAgICAgIHByZWxvYWQoY3VycmVudEluZGV4ICsgMSlcclxuICAgICAgcHJlbG9hZChjdXJyZW50SW5kZXggLSAxKVxyXG5cclxuICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbG9zZSB0aGUgbGlnaHRib3hcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIE9wdGlvbmFsIGNhbGxiYWNrIHRvIGNhbGwgYWZ0ZXIgY2xvc2VcclxuICAgICAqL1xyXG4gICAgdmFyIGNsb3NlID0gZnVuY3Rpb24gY2xvc2UgKGNhbGxiYWNrKSB7XHJcbiAgICAgIGlmICghaXNPcGVuKCkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RvYmkgaXMgYWxyZWFkeSBjbG9zZWQuJylcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFjb25maWcuc2Nyb2xsKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3RvYmktaXMtb3BlbicpXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCd0b2JpLWlzLW9wZW4nKVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBVbmJpbmQgZXZlbnRzXHJcbiAgICAgIHVuYmluZEV2ZW50cygpXHJcblxyXG4gICAgICAvLyBSZWVuYWJsZSB0aGUgdXNlcuKAmXMgZm9jdXNcclxuICAgICAgbGFzdEZvY3VzLmZvY3VzKClcclxuXHJcbiAgICAgIC8vIERvbid0IGZvcmdldCB0byBjbGVhbnVwIG91ciBjdXJyZW50IGVsZW1lbnRcclxuICAgICAgdmFyIGNvbnRhaW5lciA9IHNsaWRlckVsZW1lbnRzW2N1cnJlbnRJbmRleF0ucXVlcnlTZWxlY3RvcignLnRvYmlfX3NsaWRlcl9fc2xpZGVfX2NvbnRlbnQnKVxyXG4gICAgICB2YXIgdHlwZSA9IGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpXHJcbiAgICAgIHN1cHBvcnRlZEVsZW1lbnRzW3R5cGVdLm9uTGVhdmUoY29udGFpbmVyKVxyXG4gICAgICBzdXBwb3J0ZWRFbGVtZW50c1t0eXBlXS5vbkNsZWFudXAoY29udGFpbmVyKVxyXG5cclxuICAgICAgbGlnaHRib3guc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcclxuXHJcbiAgICAgIC8vIFJlc2V0IGN1cnJlbnQgaW5kZXhcclxuICAgICAgY3VycmVudEluZGV4ID0gMFxyXG5cclxuICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcmVsb2FkIHNsaWRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggdG8gcHJlbG9hZFxyXG4gICAgICovXHJcbiAgICB2YXIgcHJlbG9hZCA9IGZ1bmN0aW9uIHByZWxvYWQgKGluZGV4KSB7XHJcbiAgICAgIGlmIChzbGlkZXJFbGVtZW50c1tpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY29udGFpbmVyID0gc2xpZGVyRWxlbWVudHNbaW5kZXhdLnF1ZXJ5U2VsZWN0b3IoJy50b2JpX19zbGlkZXJfX3NsaWRlX19jb250ZW50JylcclxuICAgICAgdmFyIHR5cGUgPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKVxyXG5cclxuICAgICAgc3VwcG9ydGVkRWxlbWVudHNbdHlwZV0ub25QcmVsb2FkKGNvbnRhaW5lcilcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExvYWQgc2xpZGVcclxuICAgICAqIFdpbGwgYmUgY2FsbGVkIHdoZW4gb3BlbmluZyB0aGUgbGlnaHRib3ggb3IgbW92aW5nIGluZGV4XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gSW5kZXggdG8gbG9hZFxyXG4gICAgICovXHJcbiAgICB2YXIgbG9hZCA9IGZ1bmN0aW9uIGxvYWQgKGluZGV4KSB7XHJcbiAgICAgIGlmIChzbGlkZXJFbGVtZW50c1tpbmRleF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgY29udGFpbmVyID0gc2xpZGVyRWxlbWVudHNbaW5kZXhdLnF1ZXJ5U2VsZWN0b3IoJy50b2JpX19zbGlkZXJfX3NsaWRlX19jb250ZW50JylcclxuICAgICAgdmFyIHR5cGUgPSBjb250YWluZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKVxyXG5cclxuICAgICAgc3VwcG9ydGVkRWxlbWVudHNbdHlwZV0ub25Mb2FkKGNvbnRhaW5lcilcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE5hdmlnYXRlIHRvIHRoZSBwcmV2aW91cyBzbGlkZVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gT3B0aW9uYWwgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAqL1xyXG4gICAgdmFyIHByZXYgPSBmdW5jdGlvbiBwcmV2IChjYWxsYmFjaykge1xyXG4gICAgICBpZiAoY3VycmVudEluZGV4ID4gMCkge1xyXG4gICAgICAgIGxlYXZlKGN1cnJlbnRJbmRleClcclxuICAgICAgICBsb2FkKC0tY3VycmVudEluZGV4KVxyXG4gICAgICAgIHVwZGF0ZUxpZ2h0Ym94KCdsZWZ0JylcclxuICAgICAgICBjbGVhbnVwKGN1cnJlbnRJbmRleCArIDEpXHJcbiAgICAgICAgcHJlbG9hZChjdXJyZW50SW5kZXggLSAxKVxyXG5cclxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE5hdmlnYXRlIHRvIHRoZSBuZXh0IHNsaWRlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICovXHJcbiAgICB2YXIgbmV4dCA9IGZ1bmN0aW9uIG5leHQgKGNhbGxiYWNrKSB7XHJcbiAgICAgIGlmIChjdXJyZW50SW5kZXggPCBlbGVtZW50c0xlbmd0aCAtIDEpIHtcclxuICAgICAgICBsZWF2ZShjdXJyZW50SW5kZXgpXHJcbiAgICAgICAgbG9hZCgrK2N1cnJlbnRJbmRleClcclxuICAgICAgICB1cGRhdGVMaWdodGJveCgncmlnaHQnKVxyXG4gICAgICAgIGNsZWFudXAoY3VycmVudEluZGV4IC0gMSlcclxuICAgICAgICBwcmVsb2FkKGN1cnJlbnRJbmRleCArIDEpXHJcblxyXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGVhdmUgc2xpZGVcclxuICAgICAqIFdpbGwgYmUgY2FsbGVkIGJlZm9yZSBtb3ZpbmcgaW5kZXhcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBJbmRleCB0byBsZWF2ZVxyXG4gICAgICovXHJcbiAgICB2YXIgbGVhdmUgPSBmdW5jdGlvbiBsZWF2ZSAoaW5kZXgpIHtcclxuICAgICAgaWYgKHNsaWRlckVsZW1lbnRzW2luZGV4XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjb250YWluZXIgPSBzbGlkZXJFbGVtZW50c1tpbmRleF0ucXVlcnlTZWxlY3RvcignLnRvYmlfX3NsaWRlcl9fc2xpZGVfX2NvbnRlbnQnKVxyXG4gICAgICB2YXIgdHlwZSA9IGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpXHJcblxyXG4gICAgICBzdXBwb3J0ZWRFbGVtZW50c1t0eXBlXS5vbkxlYXZlKGNvbnRhaW5lcilcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFudXAgc2xpZGVcclxuICAgICAqIFdpbGwgYmUgY2FsbGVkIGFmdGVyIG1vdmluZyBpbmRleFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIEluZGV4IHRvIGNsZWFudXBcclxuICAgICAqL1xyXG4gICAgdmFyIGNsZWFudXAgPSBmdW5jdGlvbiBjbGVhbnVwIChpbmRleCkge1xyXG4gICAgICBpZiAoc2xpZGVyRWxlbWVudHNbaW5kZXhdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGNvbnRhaW5lciA9IHNsaWRlckVsZW1lbnRzW2luZGV4XS5xdWVyeVNlbGVjdG9yKCcudG9iaV9fc2xpZGVyX19zbGlkZV9fY29udGVudCcpXHJcbiAgICAgIHZhciB0eXBlID0gY29udGFpbmVyLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJylcclxuXHJcbiAgICAgIHN1cHBvcnRlZEVsZW1lbnRzW3R5cGVdLm9uQ2xlYW51cChjb250YWluZXIpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgdGhlIG9mZnNldFxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIHVwZGF0ZU9mZnNldCA9IGZ1bmN0aW9uIHVwZGF0ZU9mZnNldCAoKSB7XHJcbiAgICAgIG9mZnNldCA9IC1jdXJyZW50SW5kZXggKiB3aW5kb3cuaW5uZXJXaWR0aFxyXG5cclxuICAgICAgc2xpZGVyLnN0eWxlW3RyYW5zZm9ybVByb3BlcnR5XSA9ICd0cmFuc2xhdGUzZCgnICsgb2Zmc2V0ICsgJ3B4LCAwLCAwKSdcclxuICAgICAgb2Zmc2V0VG1wID0gb2Zmc2V0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgdGhlIGNvdW50ZXJcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciB1cGRhdGVDb3VudGVyID0gZnVuY3Rpb24gdXBkYXRlQ291bnRlciAoKSB7XHJcbiAgICAgIGNvdW50ZXIudGV4dENvbnRlbnQgPSAoY3VycmVudEluZGV4ICsgMSkgKyAnLycgKyBlbGVtZW50c0xlbmd0aFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSBmb2N1cyB0byB0aGUgbmV4dCBlbGVtZW50XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGRpciAtIEN1cnJlbnQgc2xpZGUgZGlyZWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHZhciB1cGRhdGVGb2N1cyA9IGZ1bmN0aW9uIHVwZGF0ZUZvY3VzIChkaXIpIHtcclxuICAgICAgdmFyIGZvY3VzYWJsZUVscyA9IG51bGxcclxuXHJcbiAgICAgIGlmIChjb25maWcubmF2KSB7XHJcbiAgICAgICAgLy8gRGlzcGxheSB0aGUgbmV4dCBhbmQgcHJldmlvdXMgYnV0dG9uc1xyXG4gICAgICAgIHByZXZCdXR0b24uZGlzYWJsZWQgPSBmYWxzZVxyXG4gICAgICAgIG5leHRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZVxyXG5cclxuICAgICAgICBpZiAoZWxlbWVudHNMZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIC8vIEhpZGUgdGhlIG5leHQgYW5kIHByZXZpb3VzIGJ1dHRvbnMgaWYgdGhlcmUgaXMgb25seSBvbmUgc2xpZGVcclxuICAgICAgICAgIHByZXZCdXR0b24uZGlzYWJsZWQgPSB0cnVlXHJcbiAgICAgICAgICBuZXh0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxyXG5cclxuICAgICAgICAgIGlmIChjb25maWcuY2xvc2UpIHtcclxuICAgICAgICAgICAgY2xvc2VCdXR0b24uZm9jdXMoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAvLyBIaWRlIHRoZSBwcmV2aW91cyBidXR0b24gd2hlbiB0aGUgZmlyc3Qgc2xpZGUgaXMgZGlzcGxheWVkXHJcbiAgICAgICAgICBwcmV2QnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxyXG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudEluZGV4ID09PSBlbGVtZW50c0xlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIC8vIEhpZGUgdGhlIG5leHQgYnV0dG9uIHdoZW4gdGhlIGxhc3Qgc2xpZGUgaXMgZGlzcGxheWVkXHJcbiAgICAgICAgICBuZXh0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFkaXIgJiYgIW5leHRCdXR0b24uZGlzYWJsZWQpIHtcclxuICAgICAgICAgIG5leHRCdXR0b24uZm9jdXMoKVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIWRpciAmJiBuZXh0QnV0dG9uLmRpc2FibGVkICYmICFwcmV2QnV0dG9uLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICBwcmV2QnV0dG9uLmZvY3VzKClcclxuICAgICAgICB9IGVsc2UgaWYgKCFuZXh0QnV0dG9uLmRpc2FibGVkICYmIGRpciA9PT0gJ3JpZ2h0Jykge1xyXG4gICAgICAgICAgbmV4dEJ1dHRvbi5mb2N1cygpXHJcbiAgICAgICAgfSBlbHNlIGlmIChuZXh0QnV0dG9uLmRpc2FibGVkICYmIGRpciA9PT0gJ3JpZ2h0JyAmJiAhcHJldkJ1dHRvbi5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgcHJldkJ1dHRvbi5mb2N1cygpXHJcbiAgICAgICAgfSBlbHNlIGlmICghcHJldkJ1dHRvbi5kaXNhYmxlZCAmJiBkaXIgPT09ICdsZWZ0Jykge1xyXG4gICAgICAgICAgcHJldkJ1dHRvbi5mb2N1cygpXHJcbiAgICAgICAgfSBlbHNlIGlmIChwcmV2QnV0dG9uLmRpc2FibGVkICYmIGRpciA9PT0gJ2xlZnQnICYmICFuZXh0QnV0dG9uLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICBuZXh0QnV0dG9uLmZvY3VzKClcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoY29uZmlnLmNsb3NlKSB7XHJcbiAgICAgICAgY2xvc2VCdXR0b24uZm9jdXMoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBmb2N1c2FibGVFbHMgPSBsaWdodGJveC5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b246bm90KDpkaXNhYmxlZCknKVxyXG4gICAgICBmaXJzdEZvY3VzYWJsZUVsID0gZm9jdXNhYmxlRWxzWzBdXHJcbiAgICAgIGxhc3RGb2N1c2FibGVFbCA9IGZvY3VzYWJsZUVscy5sZW5ndGggPT09IDEgPyBmb2N1c2FibGVFbHNbMF0gOiBmb2N1c2FibGVFbHNbZm9jdXNhYmxlRWxzLmxlbmd0aCAtIDFdXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciBkcmFnIGFmdGVyIHRvdWNoZW5kIGFuZCBtb3VzdXAgZXZlbnRcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBjbGVhckRyYWcgPSBmdW5jdGlvbiBjbGVhckRyYWcgKCkge1xyXG4gICAgICBkcmFnID0ge1xyXG4gICAgICAgIHN0YXJ0WDogMCxcclxuICAgICAgICBlbmRYOiAwLFxyXG4gICAgICAgIHN0YXJ0WTogMCxcclxuICAgICAgICBlbmRZOiAwXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY2FsY3VsYXRlIGRyYWcgLyBzd2lwZSBldmVudFxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIHVwZGF0ZUFmdGVyRHJhZyA9IGZ1bmN0aW9uIHVwZGF0ZUFmdGVyRHJhZyAoKSB7XHJcbiAgICAgIHZhciBtb3ZlbWVudFggPSBkcmFnLmVuZFggLSBkcmFnLnN0YXJ0WCxcclxuICAgICAgICBtb3ZlbWVudFkgPSBkcmFnLmVuZFkgLSBkcmFnLnN0YXJ0WSxcclxuICAgICAgICBtb3ZlbWVudFhEaXN0YW5jZSA9IE1hdGguYWJzKG1vdmVtZW50WCksXHJcbiAgICAgICAgbW92ZW1lbnRZRGlzdGFuY2UgPSBNYXRoLmFicyhtb3ZlbWVudFkpXHJcblxyXG4gICAgICBpZiAobW92ZW1lbnRYID4gMCAmJiBtb3ZlbWVudFhEaXN0YW5jZSA+IGNvbmZpZy50aHJlc2hvbGQgJiYgY3VycmVudEluZGV4ID4gMCkge1xyXG4gICAgICAgIHByZXYoKVxyXG4gICAgICB9IGVsc2UgaWYgKG1vdmVtZW50WCA8IDAgJiYgbW92ZW1lbnRYRGlzdGFuY2UgPiBjb25maWcudGhyZXNob2xkICYmIGN1cnJlbnRJbmRleCAhPT0gZWxlbWVudHNMZW5ndGggLSAxKSB7XHJcbiAgICAgICAgbmV4dCgpXHJcbiAgICAgIH0gZWxzZSBpZiAobW92ZW1lbnRZIDwgMCAmJiBtb3ZlbWVudFlEaXN0YW5jZSA+IGNvbmZpZy50aHJlc2hvbGQgJiYgY29uZmlnLnN3aXBlQ2xvc2UpIHtcclxuICAgICAgICBjbG9zZSgpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdXBkYXRlT2Zmc2V0KClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xpY2sgZXZlbnQgaGFuZGxlclxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIGNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIGNsaWNrSGFuZGxlciAoZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gcHJldkJ1dHRvbikge1xyXG4gICAgICAgIHByZXYoKVxyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gbmV4dEJ1dHRvbikge1xyXG4gICAgICAgIG5leHQoKVxyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gY2xvc2VCdXR0b24gfHwgZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ3RvYmlfX3NsaWRlcl9fc2xpZGUnKSB7XHJcbiAgICAgICAgY2xvc2UoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogS2V5ZG93biBldmVudCBoYW5kbGVyXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIga2V5ZG93bkhhbmRsZXIgPSBmdW5jdGlvbiBrZXlkb3duSGFuZGxlciAoZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDkpIHtcclxuICAgICAgICAvLyBgVEFCYCBLZXk6IE5hdmlnYXRlIHRvIHRoZSBuZXh0L3ByZXZpb3VzIGZvY3VzYWJsZSBlbGVtZW50XHJcbiAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAvLyBTdGVwIGJhY2t3YXJkcyBpbiB0aGUgdGFiLW9yZGVyXHJcbiAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RGb2N1c2FibGVFbCkge1xyXG4gICAgICAgICAgICBsYXN0Rm9jdXNhYmxlRWwuZm9jdXMoKVxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIFN0ZXAgZm9yd2FyZCBpbiB0aGUgdGFiLW9yZGVyXHJcbiAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdEZvY3VzYWJsZUVsKSB7XHJcbiAgICAgICAgICAgIGZpcnN0Rm9jdXNhYmxlRWwuZm9jdXMoKVxyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDI3KSB7XHJcbiAgICAgICAgLy8gYEVTQ2AgS2V5OiBDbG9zZSB0aGUgbGlnaHRib3hcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgY2xvc2UoKVxyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM3KSB7XHJcbiAgICAgICAgLy8gYFBSRVZgIEtleTogTmF2aWdhdGUgdG8gdGhlIHByZXZpb3VzIHNsaWRlXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIHByZXYoKVxyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM5KSB7XHJcbiAgICAgICAgLy8gYE5FWFRgIEtleTogTmF2aWdhdGUgdG8gdGhlIG5leHQgc2xpZGVcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgbmV4dCgpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRvdWNoc3RhcnQgZXZlbnQgaGFuZGxlclxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIHRvdWNoc3RhcnRIYW5kbGVyID0gZnVuY3Rpb24gdG91Y2hzdGFydEhhbmRsZXIgKGV2ZW50KSB7XHJcbiAgICAgIC8vIFByZXZlbnQgZHJhZ2dpbmcgLyBzd2lwaW5nIG9uIHRleHRhcmVhcyBpbnB1dHMsIHNlbGVjdHMgYW5kIHZpZGVvc1xyXG4gICAgICB2YXIgaWdub3JlRWxlbWVudHMgPSBbJ1RFWFRBUkVBJywgJ09QVElPTicsICdJTlBVVCcsICdTRUxFQ1QnLCAnVklERU8nXS5pbmRleE9mKGV2ZW50LnRhcmdldC5ub2RlTmFtZSkgIT09IC0xXHJcblxyXG4gICAgICBpZiAoaWdub3JlRWxlbWVudHMpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgIHBvaW50ZXJEb3duID0gdHJ1ZVxyXG5cclxuICAgICAgZHJhZy5zdGFydFggPSBldmVudC50b3VjaGVzWzBdLnBhZ2VYXHJcbiAgICAgIGRyYWcuc3RhcnRZID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVG91Y2htb3ZlIGV2ZW50IGhhbmRsZXJcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciB0b3VjaG1vdmVIYW5kbGVyID0gZnVuY3Rpb24gdG91Y2htb3ZlSGFuZGxlciAoZXZlbnQpIHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgIGlmIChwb2ludGVyRG93bikge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICAgICAgZHJhZy5lbmRYID0gZXZlbnQudG91Y2hlc1swXS5wYWdlWFxyXG4gICAgICAgIGRyYWcuZW5kWSA9IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVlcclxuXHJcbiAgICAgICAgc2xpZGVyLnN0eWxlW3RyYW5zZm9ybVByb3BlcnR5XSA9ICd0cmFuc2xhdGUzZCgnICsgKG9mZnNldFRtcCAtIE1hdGgucm91bmQoZHJhZy5zdGFydFggLSBkcmFnLmVuZFgpKSArICdweCwgMCwgMCknXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRvdWNoZW5kIGV2ZW50IGhhbmRsZXJcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciB0b3VjaGVuZEhhbmRsZXIgPSBmdW5jdGlvbiB0b3VjaGVuZEhhbmRsZXIgKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcblxyXG4gICAgICBwb2ludGVyRG93biA9IGZhbHNlXHJcblxyXG4gICAgICBpZiAoZHJhZy5lbmRYKSB7XHJcbiAgICAgICAgdXBkYXRlQWZ0ZXJEcmFnKClcclxuICAgICAgfVxyXG5cclxuICAgICAgY2xlYXJEcmFnKClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vdXNlZG93biBldmVudCBoYW5kbGVyXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgbW91c2Vkb3duSGFuZGxlciA9IGZ1bmN0aW9uIG1vdXNlZG93bkhhbmRsZXIgKGV2ZW50KSB7XHJcbiAgICAgIC8vIFByZXZlbnQgZHJhZ2dpbmcgLyBzd2lwaW5nIG9uIHRleHRhcmVhcyBpbnB1dHMsIHNlbGVjdHMgYW5kIHZpZGVvc1xyXG4gICAgICB2YXIgaWdub3JlRWxlbWVudHMgPSBbJ1RFWFRBUkVBJywgJ09QVElPTicsICdJTlBVVCcsICdTRUxFQ1QnLCAnVklERU8nXS5pbmRleE9mKGV2ZW50LnRhcmdldC5ub2RlTmFtZSkgIT09IC0xXHJcblxyXG4gICAgICBpZiAoaWdub3JlRWxlbWVudHMpIHtcclxuICAgICAgICByZXR1cm5cclxuICAgICAgfVxyXG5cclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG5cclxuICAgICAgcG9pbnRlckRvd24gPSB0cnVlXHJcbiAgICAgIGRyYWcuc3RhcnRYID0gZXZlbnQucGFnZVhcclxuICAgICAgZHJhZy5zdGFydFkgPSBldmVudC5wYWdlWVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTW91c2Vtb3ZlIGV2ZW50IGhhbmRsZXJcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBtb3VzZW1vdmVIYW5kbGVyID0gZnVuY3Rpb24gbW91c2Vtb3ZlSGFuZGxlciAoZXZlbnQpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgICAgaWYgKHBvaW50ZXJEb3duKSB7XHJcbiAgICAgICAgZHJhZy5lbmRYID0gZXZlbnQucGFnZVhcclxuICAgICAgICBkcmFnLmVuZFkgPSBldmVudC5wYWdlWVxyXG5cclxuICAgICAgICBzbGlkZXIuc3R5bGVbdHJhbnNmb3JtUHJvcGVydHldID0gJ3RyYW5zbGF0ZTNkKCcgKyAob2Zmc2V0VG1wIC0gTWF0aC5yb3VuZChkcmFnLnN0YXJ0WCAtIGRyYWcuZW5kWCkpICsgJ3B4LCAwLCAwKSdcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTW91c2V1cCBldmVudCBoYW5kbGVyXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgbW91c2V1cEhhbmRsZXIgPSBmdW5jdGlvbiBtb3VzZXVwSGFuZGxlciAoZXZlbnQpIHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuXHJcbiAgICAgIHBvaW50ZXJEb3duID0gZmFsc2VcclxuXHJcbiAgICAgIGlmIChkcmFnLmVuZFgpIHtcclxuICAgICAgICB1cGRhdGVBZnRlckRyYWcoKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjbGVhckRyYWcoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmluZCBldmVudHNcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBiaW5kRXZlbnRzID0gZnVuY3Rpb24gYmluZEV2ZW50cyAoKSB7XHJcbiAgICAgIGlmIChjb25maWcua2V5Ym9hcmQpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bkhhbmRsZXIpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENsaWNrIGV2ZW50c1xyXG4gICAgICBpZiAoY29uZmlnLmRvY0Nsb3NlKSB7XHJcbiAgICAgICAgbGlnaHRib3guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHByZXZCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpXHJcbiAgICAgIG5leHRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpXHJcbiAgICAgIGNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKVxyXG5cclxuICAgICAgaWYgKGNvbmZpZy5kcmFnZ2FibGUpIHtcclxuICAgICAgICAvLyBUb3VjaCBldmVudHNcclxuICAgICAgICBsaWdodGJveC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdG91Y2hzdGFydEhhbmRsZXIpXHJcbiAgICAgICAgbGlnaHRib3guYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdG91Y2htb3ZlSGFuZGxlcilcclxuICAgICAgICBsaWdodGJveC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRvdWNoZW5kSGFuZGxlcilcclxuXHJcbiAgICAgICAgLy8gTW91c2UgZXZlbnRzXHJcbiAgICAgICAgbGlnaHRib3guYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2Vkb3duSGFuZGxlcilcclxuICAgICAgICBsaWdodGJveC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2V1cEhhbmRsZXIpXHJcbiAgICAgICAgbGlnaHRib3guYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlSGFuZGxlcilcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5iaW5kIGV2ZW50c1xyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIHVuYmluZEV2ZW50cyA9IGZ1bmN0aW9uIHVuYmluZEV2ZW50cyAoKSB7XHJcbiAgICAgIGlmIChjb25maWcua2V5Ym9hcmQpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5ZG93bkhhbmRsZXIpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIENsaWNrIGV2ZW50c1xyXG4gICAgICBpZiAoY29uZmlnLmRvY0Nsb3NlKSB7XHJcbiAgICAgICAgbGlnaHRib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHByZXZCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpXHJcbiAgICAgIG5leHRCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0hhbmRsZXIpXHJcbiAgICAgIGNsb3NlQnV0dG9uLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKVxyXG5cclxuICAgICAgaWYgKGNvbmZpZy5kcmFnZ2FibGUpIHtcclxuICAgICAgICAvLyBUb3VjaCBldmVudHNcclxuICAgICAgICBsaWdodGJveC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdG91Y2hzdGFydEhhbmRsZXIpXHJcbiAgICAgICAgbGlnaHRib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdG91Y2htb3ZlSGFuZGxlcilcclxuICAgICAgICBsaWdodGJveC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRvdWNoZW5kSGFuZGxlcilcclxuXHJcbiAgICAgICAgLy8gTW91c2UgZXZlbnRzXHJcbiAgICAgICAgbGlnaHRib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2Vkb3duSGFuZGxlcilcclxuICAgICAgICBsaWdodGJveC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2V1cEhhbmRsZXIpXHJcbiAgICAgICAgbGlnaHRib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlSGFuZGxlcilcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgZWxlbWVudCBoYXMgcmVxdWVzdGVkIGRhdGEtdHlwZSB2YWx1ZVxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgdmFyIGNoZWNrVHlwZSA9IGZ1bmN0aW9uIGNoZWNrVHlwZSAoZWxlbWVudCwgdHlwZSkge1xyXG4gICAgICByZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpID09PSB0eXBlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYWxsIGBzcmNgIGF0dHJpYnV0ZXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gRWxlbWVudCB0byByZW1vdmUgYWxsIGBzcmNgIGF0dHJpYnV0ZXNcclxuICAgICAqL1xyXG4gICAgdmFyIHJlbW92ZVNvdXJjZXMgPSBmdW5jdGlvbiBzZXRWaWRlb1NvdXJjZXMgKGVsZW1lbnQpIHtcclxuICAgICAgdmFyIHNvdXJjZXMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NyYycpXHJcblxyXG4gICAgICBpZiAoc291cmNlcykge1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoc291cmNlcywgZnVuY3Rpb24gKHNvdXJjZSkge1xyXG4gICAgICAgICAgc291cmNlLnNldEF0dHJpYnV0ZSgnc3JjJywgJycpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIGxpZ2h0Ym94XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGRpciAtIEN1cnJlbnQgc2xpZGUgZGlyZWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHZhciB1cGRhdGVMaWdodGJveCA9IGZ1bmN0aW9uIHVwZGF0ZUxpZ2h0Ym94IChkaXIpIHtcclxuICAgICAgdXBkYXRlT2Zmc2V0KClcclxuICAgICAgdXBkYXRlQ291bnRlcigpXHJcbiAgICAgIHVwZGF0ZUZvY3VzKGRpcilcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc2V0IHRoZSBsaWdodGJveFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gT3B0aW9uYWwgY2FsbGJhY2sgdG8gY2FsbCBhZnRlciByZXNldFxyXG4gICAgICovXHJcbiAgICB2YXIgcmVzZXQgPSBmdW5jdGlvbiByZXNldCAoY2FsbGJhY2spIHtcclxuICAgICAgaWYgKHNsaWRlcikge1xyXG4gICAgICAgIHdoaWxlIChzbGlkZXIuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgc2xpZGVyLnJlbW92ZUNoaWxkKHNsaWRlci5maXJzdENoaWxkKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZ2FsbGVyeS5sZW5ndGggPSBzbGlkZXJFbGVtZW50cy5sZW5ndGggPSBlbGVtZW50c0xlbmd0aCA9IGZpZ2NhcHRpb25JZCA9IHggPSAwXHJcblxyXG4gICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRoZSBsaWdodGJveCBpcyBvcGVuXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICB2YXIgaXNPcGVuID0gZnVuY3Rpb24gaXNPcGVuICgpIHtcclxuICAgICAgcmV0dXJuIGxpZ2h0Ym94LmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSA9PT0gJ2ZhbHNlJ1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIGN1cnJlbnQgaW5kZXhcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHZhciBjdXJyZW50U2xpZGUgPSBmdW5jdGlvbiBjdXJyZW50U2xpZGUgKCkge1xyXG4gICAgICByZXR1cm4gY3VycmVudEluZGV4XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCh1c2VyT3B0aW9ucylcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBvcGVuOiBvcGVuLFxyXG4gICAgICBwcmV2OiBwcmV2LFxyXG4gICAgICBuZXh0OiBuZXh0LFxyXG4gICAgICBjbG9zZTogY2xvc2UsXHJcbiAgICAgIGFkZDogYWRkLFxyXG4gICAgICByZXNldDogcmVzZXQsXHJcbiAgICAgIGlzT3BlbjogaXNPcGVuLFxyXG4gICAgICBjdXJyZW50U2xpZGU6IGN1cnJlbnRTbGlkZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFRvYmlcclxufSkpXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3JxcmF1aHZtcmFfX3RvYmkvanMvdG9iaS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9