/* eslint-disable */
var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, {get: all[name], enumerable: true});
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError('Cannot ' + msg);
var __privateGet = (obj, member, getter) => (
  __accessCheck(obj, member, 'read from private field'), getter ? getter.call(obj) : member.get(obj)
);
var __privateAdd = (obj, member, value) =>
  member.has(obj)
    ? __typeError('Cannot add the same private member more than once')
    : member instanceof WeakSet
    ? member.add(obj)
    : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (
  __accessCheck(obj, member, 'write to private field'),
  setter ? setter.call(obj, value) : member.set(obj, value),
  value
);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, 'access private method'), method);

// src/api/index.ts
var api_exports = {};
__export(api_exports, {
  clientStatuses: () => clientStatuses,
  itemClassifications: () => itemClassifications,
  itemsHandlingFlags: () => itemsHandlingFlags,
  permissions: () => permissions,
  slotTypes: () => slotTypes,
});

// src/api/constants.ts
var clientStatuses = {
  /**
   * Client is in an unknown or disconnected state. This status is set automatically initially and when all connected
   * clients have disconnected from the server.
   */
  disconnected: 0,
  /** Client is currently connected. This status is set automatically when a client connects. */
  connected: 5,
  /** Client is ready to start, but hasn't started playing yet. */
  ready: 10,
  /** Client is currently playing. */
  playing: 20,
  /** Client has completed their goal. Once set, cannot be changed. */
  goal: 30,
};
var itemClassifications = {
  /** If set, indicates the item may unlock logical advancement. */
  progression: 1,
  /** If set, indicates the item is classified as useful to have. */
  useful: 2,
  /** If set, indicates the item can inconvenience a player. */
  trap: 4,
  /** A shorthand with no flags set, also known as 'filler' or 'junk' items. */
  none: 0,
};
var itemsHandlingFlags = {
  /** Indicates the client only receives items created by cheat commands. */
  minimal: 0,
  /** Indicates the client get items sent from other worlds. */
  others: 1,
  /** Indicates the client get items sent from your own world. Requires `others` bitflag to be set. */
  own: 2,
  /** Indicates the client get your starting inventory sent. Requires `others` bitflag to be set. */
  starting: 4,
  /** Shorthand for `others`, `own`, and `starting`. */
  all: 7,
};
var permissions = {
  /** Prevents players from using this command at any time. */
  disabled: 0,
  /** Allows players to use this command manually at any time. */
  enabled: 1,
  /** Allows players to use this command manually after they have completed their goal. */
  goal: 2,
  /**
   * Forces players to use this command after they have completed their goal.
   * @remarks Only allowed on `release` and `collect` permissions.
   */
  auto: 6,
  /**
   * Allows players to use this command manually at any time and forces them to use this command after they have
   * completed their goal.
   * @remarks Only allowed on `release` and `collect` permissions.
   */
  autoEnabled: 7,
};
var slotTypes = {
  /** This client is a spectator and not participating in the current game. */
  spectator: 0,
  /** This client is a player and is participating in the current game. */
  player: 1,
  /** This client is an item links group containing at least 1 player with active item links. */
  group: 2,
};

// src/errors.ts
var SocketError = class extends Error {};
var ArgumentError = class extends Error {
  /**
   * Instantiates an ArgumentError object.
   * @internal
   * @param message A human-readable error description.
   * @param argumentName The name of the argument with an invalid value.
   * @param value The value of the invalid argument.
   */
  constructor(message, argumentName, value) {
    super(message);
    this.argumentName = argumentName;
    this.value = structuredClone(value);
  }
};
var LoginError = class extends Error {
  /**
   * Instantiates a LoginError object.
   * @internal
   * @param message A human-readable error description.
   * @param errors A list of connection errors the server can be returned from the server.
   */
  constructor(message, errors) {
    super(message);
    /** A list of connection errors that prevented the connection to the Archipelago server. */
    this.errors = [];
    this.errors = errors;
  }
};
var UnauthenticatedError = class extends Error {};

// src/interfaces/ClientOptions.ts
var defaultClientOptions = {
  timeout: 1e4,
  autoFetchDataPackage: true,
  maximumMessages: 1e3,
  debugLogVersions: true,
};

// src/constants.ts
var targetVersion = {major: 0, minor: 5, build: 1};
var libraryVersion = '2.0.4';

// src/utils.ts
function uuid() {
  const uuid2 = [];
  for (let i = 0; i < 36; i++) {
    uuid2.push(Math.floor(Math.random() * 16));
  }
  uuid2[14] = 4;
  uuid2[19] = uuid2[19] &= ~(1 << 2);
  uuid2[19] = uuid2[19] |= 1 << 3;
  uuid2[8] = uuid2[13] = uuid2[18] = uuid2[23] = '-';
  return uuid2.map((d) => d.toString(16)).join('');
}

// src/interfaces/ConnectionOptions.ts
var defaultConnectionOptions = {
  password: '',
  uuid: uuid(),
  tags: [],
  version: targetVersion,
  items: itemsHandlingFlags.all,
  slotData: true,
};

// src/classes/Item.ts
var _client, _item, _sender, _receiver;
var Item = class {
  /**
   * Instantiates a new ItemMetadata.
   * @internal
   * @param client The Archipelago client associated with this manager.
   * @param item The network item data from the network protocol.
   * @param sender The player to send this item.
   * @param receiver The player to receive this item.
   */
  constructor(client, item, sender, receiver) {
    __privateAdd(this, _client);
    __privateAdd(this, _item);
    __privateAdd(this, _sender);
    __privateAdd(this, _receiver);
    __privateSet(this, _client, client);
    __privateSet(this, _item, item);
    __privateSet(this, _sender, sender);
    __privateSet(this, _receiver, receiver);
  }
  /** Returns the name of this item. */
  toString() {
    return this.name;
  }
  /** Returns the metadata for the player who receives this item. */
  get receiver() {
    return __privateGet(this, _receiver);
  }
  /** Returns the metadata for the player who finds this item. */
  get sender() {
    return __privateGet(this, _sender);
  }
  /** Returns the name of this item. */
  get name() {
    return __privateGet(this, _client).package.lookupItemName(
      this.game,
      __privateGet(this, _item).item,
      true
    );
  }
  /** Returns the integer id of this item. */
  get id() {
    return __privateGet(this, _item).item;
  }
  /** Returns the name of the location where this item was contained. */
  get locationName() {
    return __privateGet(this, _client).package.lookupLocationName(
      this.sender.game,
      __privateGet(this, _item).location,
      true
    );
  }
  /** Returns the id of the location where this item was contained. */
  get locationId() {
    return __privateGet(this, _item).location;
  }
  /** Returns the game name for the location this item was contained. */
  get locationGame() {
    return this.sender.game;
  }
  /** Returns the game name for this item. */
  get game() {
    return this.receiver.game;
  }
  /** Returns `true` if this item is flagged as progression. */
  get progression() {
    return (this.flags & itemClassifications.progression) === itemClassifications.progression;
  }
  /** Returns `true` if this item is flagged as useful. */
  get useful() {
    return (this.flags & itemClassifications.useful) === itemClassifications.useful;
  }
  /** Returns `true` if this item is flagged as a trap. */
  get trap() {
    return (this.flags & itemClassifications.trap) === itemClassifications.trap;
  }
  /** Returns `true` if this item has no special flags. */
  get filler() {
    return this.flags === itemClassifications.none;
  }
  /** Returns the item classification bitflags for this item. */
  get flags() {
    return __privateGet(this, _item).flags;
  }
};
_client = new WeakMap();
_item = new WeakMap();
_sender = new WeakMap();
_receiver = new WeakMap();

// src/classes/PackageMetadata.ts
var PackageMetadata = class {
  /**
   * Creates a new PackageMetadata from a given {@link GamePackage}.
   * @internal
   * @param game The name of the game for this game package.
   * @param _package The API-level game package to expand upon.
   */
  constructor(game, _package) {
    this.game = game;
    this.checksum = _package.checksum;
    this.itemTable = Object.freeze(_package.item_name_to_id);
    this.locationTable = Object.freeze(_package.location_name_to_id);
    this.reverseItemTable = Object.freeze(
      Object.fromEntries(Object.entries(this.itemTable).map(([k, v]) => [v, k]))
    );
    this.reverseLocationTable = Object.freeze(
      Object.fromEntries(Object.entries(this.locationTable).map(([k, v]) => [v, k]))
    );
  }
  /**
   * Returns a network-safe {@link GamePackage} that can be cached and preloaded ahead of time to reduce network load.
   */
  exportPackage() {
    return {
      checksum: this.checksum,
      item_name_to_id: {...this.itemTable},
      location_name_to_id: {...this.locationTable},
    };
  }
};

// src/classes/managers/DataPackageManager.ts
var _client2, _packages, _checksums, _games, _DataPackageManager_instances, preloadArchipelago_fn;
var DataPackageManager = class {
  /**
   * Instantiates a new DataPackageManager. Should only be instantiated by creating a new {@link Client}.
   * @internal
   * @param client The client object this manager is associated with.
   */
  constructor(client) {
    __privateAdd(this, _DataPackageManager_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _packages, /* @__PURE__ */ new Map());
    __privateAdd(this, _checksums, /* @__PURE__ */ new Map());
    __privateAdd(this, _games, /* @__PURE__ */ new Set());
    __privateSet(this, _client2, client);
    __privateGet(this, _client2).socket.on('roomInfo', (packet) => {
      __privateGet(this, _packages).clear();
      __privateGet(this, _checksums).clear();
      __privateGet(this, _games).clear();
      __privateGet(this, _packages).set(
        'Archipelago',
        __privateMethod(this, _DataPackageManager_instances, preloadArchipelago_fn).call(this)
      );
      for (const game in packet.datapackage_checksums) {
        __privateGet(this, _checksums).set(game, packet.datapackage_checksums[game]);
        __privateGet(this, _games).add(game);
      }
    });
  }
  /**
   * Returns the package metadata helper object for a specified game. If game package does not exist in cache, returns
   * `null` instead.
   * @param game The specific game package to look up.
   */
  findPackage(game) {
    var _a;
    return (_a = __privateGet(this, _packages).get(game)) != null ? _a : null;
  }
  /**
   * Fetches and returns the {@link DataPackage} from the server, if the games are not locally cached or checksums
   * do not match.
   * @param games A list of game packages to fetch. If omitted, will fetch all available game packages from the
   * current room.
   * @param update If `true`, after fetching the data package, any changes will automatically be updated without
   * needing to manually call {@link DataPackageManager.importPackage}.
   * @remarks It is recommended to export and locally cache the data package after fetching, then prior to any future
   * connections, importing the locally cached package to reduce unnecessary network bandwidth.
   *
   * Any requested games that do not exist in the current room will be ignored.
   */
  async fetchPackage(games = [], update = true) {
    if (games.length === 0) {
      games = Array.from(__privateGet(this, _games));
    }
    games = games.filter((game) => {
      var _a;
      if (!__privateGet(this, _games).has(game)) return false;
      if (
        ((_a = __privateGet(this, _packages).get(game)) == null ? void 0 : _a.checksum) !==
        __privateGet(this, _checksums).get(game)
      )
        return true;
      return false;
    });
    const data = {games: {}};
    for (const game of games) {
      const request = {cmd: 'GetDataPackage', games: [game]};
      const [response] = await __privateGet(this, _client2).socket.send(request).wait('dataPackage');
      data.games[game] = response.data.games[game];
    }
    if (update) {
      this.importPackage(data);
    }
    return data;
  }
  /**
   * Import a {@link DataPackage} object to prepopulate local cache.
   * @param dataPackage The package to import.
   * @remarks It is recommended to export/import any data packages ahead of time to reduce unnecessary calls to
   * {@link DataPackageManager.fetchPackage} and reduce connection startup time and lighten network overhead. See
   * below for an example.
   * @example <caption>Node.js</caption>
   * import fs from "node:fs";
   * import { Client } from "archipelago.js";
   *
   * const data = fs.readFileSync("path/to/cache/datapackage_cache.json");
   * const client = new Client();
   *
   * client.package.importPackage(JSON.parse(data));
   * await client.login("wss://archipelago.gg:38281", "Phar", "Clique");
   * @example <caption>Modern browser (using localStorage and ES-syntax)</caption>
   * <script src="archipelago.js" type="module">
   *     import { Client } from "archipelago.js";
   *
   *     const data = localStorage.getItem("datapackage_cache");
   *     const client = new Client();
   *
   *     client.package.importPackage(JSON.parse(data));
   *     await client.login("wss://archipelago.gg:38281", "Phar", "Clique");
   * <\/script>
   */
  importPackage(dataPackage) {
    for (const game in dataPackage.games) {
      __privateGet(this, _packages).set(game, new PackageMetadata(game, dataPackage.games[game]));
      __privateGet(this, _checksums).set(game, dataPackage.games[game].checksum);
    }
  }
  /**
   * Export a {@link DataPackage} object for local caching purposes.
   * @remarks It is recommended to export/import any data packages ahead of time to reduce unnecessary calls to
   * {@link DataPackageManager.fetchPackage} and reduce connection startup time and lighten network overhead. See
   * below for an example.
   * @example <caption>Node.js</caption>
   * import fs from "node:fs";
   * import { Client } from "archipelago.js";
   *
   * // ... misc client code (connecting and fetching data package).
   *
   * // Save data package to a local file.
   * const data = client.package.exportPackage();
   * fs.writeFileSync("path/to/cache/datapackage_cache.json", JSON.stringify(data), "utf8");
   */
  exportPackage() {
    return {
      games: __privateGet(this, _packages)
        .entries()
        .reduce((games, [game, pkg]) => {
          games[game] = pkg.exportPackage();
          return games;
        }, {}),
    };
  }
  lookupItemName(game, id, fallback = true) {
    const fallbackName = `Unknown Item ${id}`;
    const gamePackage = this.findPackage(game);
    if (!gamePackage) {
      return fallback ? fallbackName : void 0;
    }
    const name = gamePackage.reverseItemTable[id];
    if (fallback && name === void 0) {
      return fallbackName;
    }
    return name;
  }
  lookupLocationName(game, id, fallback = true) {
    const fallbackName = `Unknown Location ${id}`;
    const gamePackage = this.findPackage(game);
    if (!gamePackage) {
      return fallback ? fallbackName : void 0;
    }
    const name = gamePackage.reverseLocationTable[id];
    if (fallback && name === void 0) {
      return fallbackName;
    }
    return name;
  }
};
_client2 = new WeakMap();
_packages = new WeakMap();
_checksums = new WeakMap();
_games = new WeakMap();
_DataPackageManager_instances = new WeakSet();
/**
 * Returns preloaded data (i.e., Archipelago data package, since it's always available).
 * @private
 * @remarks If updates to the AP game package happen, this should be updated.
 */
preloadArchipelago_fn = function () {
  return new PackageMetadata('Archipelago', {
    checksum: 'ac9141e9ad0318df2fa27da5f20c50a842afeecb',
    item_name_to_id: {Nothing: -1},
    location_name_to_id: {'Cheat Console': -1, Server: -2},
  });
};

// src/classes/IntermediateDataOperation.ts
var _client3, _operations, _key, _default;
var IntermediateDataOperation = class {
  /**
   * Create an intermediate object for storing data operations.
   * @internal
   * @param client The Archipelago client.
   * @param key The data storage key.
   * @param _default Default value to use, if no value exists.
   */
  constructor(client, key, _default2) {
    __privateAdd(this, _client3);
    __privateAdd(this, _operations, []);
    __privateAdd(this, _key);
    __privateAdd(this, _default);
    __privateSet(this, _client3, client);
    __privateSet(this, _key, key);
    __privateSet(this, _default, _default2);
  }
  /**
   * Sets the current value of the key to `value`.
   * @param value A value for the operation to apply against the current data storage value.
   */
  replace(value) {
    __privateGet(this, _operations).push({operation: 'replace', value});
    return this;
  }
  /**
   * If the key has no value yet, sets the current value of the key to `default`.
   */
  default() {
    __privateGet(this, _operations).push({operation: 'default', value: null});
    return this;
  }
  /**
   * Adds `value` to the current value of the key, if both the current value and `value` are arrays then `value` will
   * be appended to the current value.
   * @param value A value for the operation to apply against the current data storage value.
   */
  add(value) {
    __privateGet(this, _operations).push({operation: 'add', value});
    return this;
  }
  /**
   * Multiplies the current value of the key by `value`.
   * @param value A value for the operation to apply against the current data storage value.
   */
  multiply(value) {
    __privateGet(this, _operations).push({operation: 'mul', value});
    return this;
  }
  /**
   * Multiplies the current value of the key to the power of `value`.
   * @param value A value for the operation to apply against the current data storage value.
   */
  power(value) {
    __privateGet(this, _operations).push({operation: 'pow', value});
    return this;
  }
  /**
   * Sets the current value of the key to the remainder after division by `value`.
   * @param value A value for the operation to apply against the current data storage value.
   */
  remainder(value) {
    __privateGet(this, _operations).push({operation: 'mod', value});
    return this;
  }
  /**
   * Rounds down the current value to the nearest integer.
   */
  floor() {
    __privateGet(this, _operations).push({operation: 'floor', value: null});
    return this;
  }
  /**
   * Rounds up the current value to the nearest integer.
   */
  ceiling() {
    __privateGet(this, _operations).push({operation: 'ceil', value: null});
    return this;
  }
  /**
   * Sets the current value of the key to `value` if `value` is bigger.
   * @param value A value for the operation to apply against the current data storage value.
   */
  max(value) {
    __privateGet(this, _operations).push({operation: 'max', value});
    return this;
  }
  /**
   * Sets the current value of the key to `value` if `value` is bigger.
   * @param value A value for the operation to apply against the current data storage value.
   */
  min(value) {
    __privateGet(this, _operations).push({operation: 'min', value});
    return this;
  }
  /**
   * Applies a bitwise **AND** to the current value of the key with `value`.
   * @param value A value for the operation to apply against the current data storage value.
   */
  and(value) {
    __privateGet(this, _operations).push({operation: 'and', value});
    return this;
  }
  /**
   * Applies a bitwise **OR** to the current value of the key with value.
   * @param value A value for the operation to apply against the current data storage value.
   */
  or(value) {
    __privateGet(this, _operations).push({operation: 'or', value});
    return this;
  }
  /**
   * Applies a bitwise **XOR** to the current value of the key with value.
   * @param value A value for the operation to apply against the current data storage value.
   */
  xor(value) {
    __privateGet(this, _operations).push({operation: 'xor', value});
    return this;
  }
  /**
   * Applies a bitwise left-shift to the current value of the key by `value`.
   * @param value A value for the operation to apply against the current data storage value.
   */
  leftShift(value) {
    __privateGet(this, _operations).push({operation: 'left_shift', value});
    return this;
  }
  /**
   * Applies a bitwise right-shift to the current value of the key by `value`.
   * @param value A value for the operation to apply against the current data storage value.
   */
  rightShift(value) {
    __privateGet(this, _operations).push({operation: 'right_shift', value});
    return this;
  }
  /**
   * List only: removes the first instance of `value` found in the list.
   * @param value A value for the operation to apply against the current data storage value.
   */
  remove(value) {
    __privateGet(this, _operations).push({operation: 'remove', value});
    return this;
  }
  /**
   * List or Dict only: for `lists` it will remove the index of the `value` given. For `dicts` it removes the element
   * with the specified key of `value`.
   * @param value A value for the operation to apply against the current data storage value.
   */
  pop(value) {
    __privateGet(this, _operations).push({operation: 'pop', value});
    return this;
  }
  /**
   * Dict only: Updates the dictionary with the specified elements given in `value` creating new keys, or updating old
   * ones if they previously existed.
   * @param value A value for the operation to apply against the current data storage value.
   */
  update(value) {
    __privateGet(this, _operations).push({operation: 'update', value});
    return this;
  }
  async commit(awaitReply = false) {
    const _uuid = uuid();
    const request = {
      cmd: 'Set',
      default: __privateGet(this, _default),
      key: __privateGet(this, _key),
      operations: __privateGet(this, _operations),
      want_reply: awaitReply,
      uuid: _uuid,
      // Used to identify this request/response.
    };
    __privateGet(this, _client3).socket.send(request);
    if (!awaitReply) {
      return;
    }
    const [response] = await __privateGet(this, _client3).socket.wait(
      'setReply',
      (packet) => packet.uuid === _uuid
    );
    return response.value;
  }
};
_client3 = new WeakMap();
_operations = new WeakMap();
_key = new WeakMap();
_default = new WeakMap();

// src/classes/managers/DataStorageManager.ts
var _client4, _storage, _subscribers, _DataStorageManager_instances, get_fn;
var DataStorageManager = class {
  /**
   * Instantiates a new DataStorageManager.
   * @internal
   * @param client The Archipelago client associated with this manager.
   */
  constructor(client) {
    __privateAdd(this, _DataStorageManager_instances);
    __privateAdd(this, _client4);
    __privateAdd(this, _storage, {});
    __privateAdd(this, _subscribers, {});
    __privateSet(this, _client4, client);
    __privateGet(this, _client4)
      .socket.on('disconnected', () => {
        __privateSet(this, _storage, {});
        __privateSet(this, _subscribers, {});
      })
      .on('setReply', (packet) => {
        __privateGet(this, _storage)[packet.key] = packet.value;
        const callbacks = __privateGet(this, _subscribers)[packet.key];
        if (callbacks) {
          callbacks.forEach((callback) => callback(packet.key, packet.value, packet.original_value));
        }
      })
      .on('connected', () => {
        if (__privateGet(this, _client4).options.debugLogVersions) {
          const key = `${__privateGet(this, _client4).game}:${libraryVersion}:${
            navigator == null ? void 0 : navigator.userAgent
          }`;
          void this.prepare('archipelago.js__runtimes', {})
            .default()
            .update({[key]: true})
            .commit(false);
        }
      });
  }
  /** Returns a copy of all currently monitored keys. */
  get store() {
    return structuredClone(__privateGet(this, _storage));
  }
  async fetch(input, monitor = false) {
    let keys = typeof input === 'string' ? [input] : input;
    if (monitor) {
      const monitorKeys = keys.filter((key) => __privateGet(this, _storage)[key] === void 0);
      if (monitorKeys.length > 0) {
        __privateGet(this, _client4).socket.send({cmd: 'SetNotify', keys: monitorKeys});
      }
    }
    let data = {};
    keys = keys.filter((key) => {
      const value = structuredClone(__privateGet(this, _storage)[key]);
      const exists = value !== void 0;
      if (exists) {
        data[key] = value;
      }
      return !exists;
    });
    if (keys.length > 0) {
      const response = await __privateMethod(this, _DataStorageManager_instances, get_fn).call(this, keys);
      data = {...data, ...response};
    }
    if (monitor) {
      __privateSet(this, _storage, {...__privateGet(this, _storage), ...data});
    }
    return typeof input === 'string' ? data[input] : data;
  }
  /**
   * Add a list of keys to be monitored for changes and fire a callback when changes are detected.
   * @param keys A list of keys to fetch and watch for changes.
   * @param callback A callback to fire whenever one of these keys change.
   * @returns An object containing all current values for each key requested.
   * @remarks If connection to the Archipelago server is lost, keys will no longer be tracked for changes and need to
   * be monitored again.
   * @example
   * const keys = ["key1", "key2"];
   * const data = await client.storage.notify(keys, (key, value, oldValue) => {
   *     console.log(`Key '${key}' has been updated from ${oldValue} to ${value}!`);
   * });
   *
   * client.storage
   *     .prepare("key2", 0)
   *     .add(5)
   *     .commit();
   * // Key 'key2' has been updated from 0 to 5!
   */
  async notify(keys, callback) {
    keys.forEach((key) => {
      var _a, _b;
      (_b = (_a = __privateGet(this, _subscribers))[key]) != null ? _b : (_a[key] = []);
      __privateGet(this, _subscribers)[key].push(callback);
    });
    return this.fetch(keys, true);
  }
  /**
   * Create a new transaction for setting a data storage key by returning an {@link IntermediateDataOperation}. To
   * perform certain operations, just chain additional methods until finished, then call `prepare()`.
   * @param key The key to manipulate.
   * @param _default The default value to be used if key does not exist.
   * @throws {@link TypeError} if attempting to modify a read only key.
   * @example
   * // Prepare key "my-key" and set initial value to 100, if key doesn't exist.
   * client.storage
   *     .prepare("my-key", 100)
   *     .multiply(0.25) // Multiply value by 0.25.
   *     .floor()        // Round down to nearest integer.
   *     .max(0)         // Clamp value above 0.
   *     .commit();      // Commit operations to data storage.
   */
  prepare(key, _default2) {
    if (key.startsWith('_read_')) {
      throw TypeError('Cannot manipulate read only keys.');
    }
    return new IntermediateDataOperation(__privateGet(this, _client4), key, _default2);
  }
  /**
   * Returns item name groups for this package from data storage API.
   * @param game The game name to look up item name groups for.
   */
  async fetchItemNameGroups(game) {
    return await this.fetch([`_read_item_name_groups_${game}`], true);
  }
  /**
   * Returns location name groups for this package from the data storage API.
   * @param game The game name to look up location name groups for.
   */
  async fetchLocationNameGroups(game) {
    return await this.fetch([`_read_location_name_groups_${game}`], true);
  }
};
_client4 = new WeakMap();
_storage = new WeakMap();
_subscribers = new WeakMap();
_DataStorageManager_instances = new WeakSet();
get_fn = async function (keys) {
  const _uuid = uuid();
  const [response] = await __privateGet(this, _client4)
    .socket.send({cmd: 'Get', keys, uuid: _uuid})
    .wait('retrieved', (packet) => packet.uuid === _uuid);
  return response.keys;
};

// src/classes/ArchipelagoEventEmitter.ts
var _events;
var ArchipelagoEventEmitter = class {
  constructor() {
    __privateAdd(this, _events, {});
  }
  addEventListener(event, callback, once = false) {
    var _a, _b;
    (_b = (_a = __privateGet(this, _events))[event]) != null ? _b : (_a[event] = []);
    __privateGet(this, _events)[event].push([callback, once]);
  }
  removeEventListener(event, callback) {
    const callbacks = __privateGet(this, _events)[event];
    if (callbacks && callbacks.length > 0) {
      __privateGet(this, _events)[event] = callbacks.filter(([cb]) => cb !== callback);
    }
  }
  dispatchEvent(event, data) {
    var _a;
    const callbacks = (_a = __privateGet(this, _events)[event]) != null ? _a : [];
    for (const [callback, once] of callbacks) {
      callback(...data);
      if (once) {
        this.removeEventListener(event, callback);
      }
    }
  }
};
_events = new WeakMap();

// src/classes/managers/EventBasedManager.ts
var _events2;
var EventBasedManager = class {
  constructor() {
    __privateAdd(this, _events2, new ArchipelagoEventEmitter());
  }
  /**
   * Add an event listener for a specific event.
   * @param event The event name to listen for.
   * @param listener The callback function to fire when this event is received.
   * @returns This object.
   */
  on(event, listener) {
    __privateGet(this, _events2).addEventListener(event, listener);
    return this;
  }
  /**
   * Removes an existing event listener.
   * @param event The event name associated with this listener to remove.
   * @param listener The callback function to remove.
   * @returns This object.
   */
  off(event, listener) {
    __privateGet(this, _events2).removeEventListener(event, listener);
    return this;
  }
  /**
   * Returns a promise that waits for a single specified event to be received. Resolves with the list of arguments
   * dispatched with the event.
   * @param event The event name to listen for.
   * @param clearPredicate An optional predicate to check on incoming events to validate if the correct event has
   * been received. If omitted, will return immediately on next event type received.
   */
  async wait(event, clearPredicate = () => true) {
    return new Promise((resolve) => {
      const listener = (...args) => {
        if (clearPredicate(...args)) {
          __privateGet(this, _events2).removeEventListener(event, listener);
          resolve(args);
        }
      };
      __privateGet(this, _events2).addEventListener(event, listener);
    });
  }
  /**
   * Emit a specific event.
   * @internal
   * @param event The event name to emit.
   * @param detail A list of arguments to broadcast with this event.
   * @protected
   */
  emit(event, detail) {
    __privateGet(this, _events2).dispatchEvent(event, detail);
  }
};
_events2 = new WeakMap();

// src/classes/managers/DeathLinkManager.ts
var _client5, _lastDeath;
var DeathLinkManager = class extends EventBasedManager {
  /**
   * Instantiates a new DeathLinkManager.
   * @internal
   * @param client The Archipelago client associated with this manager.
   */
  constructor(client) {
    super();
    __privateAdd(this, _client5);
    __privateAdd(this, _lastDeath, Number.MIN_SAFE_INTEGER);
    __privateSet(this, _client5, client);
    __privateGet(this, _client5).socket.on('bounced', (packet) => {
      var _a;
      if (
        ((_a = packet.tags) == null ? void 0 : _a.includes('DeathLink')) &&
        packet.data.time &&
        packet.data.source
      ) {
        const deathLink = packet.data;
        if (deathLink.time === __privateGet(this, _lastDeath)) {
          return;
        }
        __privateSet(this, _lastDeath, deathLink.time);
        this.emit('deathReceived', [deathLink.source, deathLink.time * 1e3, deathLink.cause]);
      }
    });
  }
  /** Returns `true` if this client is participating in the DeathLink mechanic. */
  get enabled() {
    return __privateGet(this, _client5).arguments.tags.includes('DeathLink');
  }
  /** Toggles the DeathLink mechanic on for this client, if disabled, by adding the DeathLink tag. */
  enableDeathLink() {
    if (__privateGet(this, _client5).arguments.tags.includes('DeathLink')) {
      return;
    }
    __privateGet(this, _client5).updateTags([...__privateGet(this, _client5).arguments.tags, 'DeathLink']);
  }
  /** Toggles the DeathLink mechanic off for this client, if enabled, by removing the DeathLink tag. */
  disableDeathLink() {
    if (!__privateGet(this, _client5).arguments.tags.includes('DeathLink')) {
      return;
    }
    __privateGet(this, _client5).updateTags(
      __privateGet(this, _client5).arguments.tags.filter((tag) => tag !== 'DeathLink')
    );
  }
  /**
   * If DeathLink is enabled, sends a DeathLink to all DeathLink enabled players, otherwise this method does nothing.
   * @param source The name of the player who died. Can be a slot name, but could also be a name from within a
   * multiplayer game.
   * @param cause Optional text explaining the cause of death. When provided, this should include the player's name.
   * (e.g., `Phar drowned in a vat of kittens.`)
   * @throws {@link UnauthenticatedError} if attempting to send a death link before authenticating to the server.
   * @remarks DeathLinks sent from this client will not fire a {@link DeathEvents.deathReceived} event to avoid
   * an infinite feedback loop of deaths.
   */
  sendDeathLink(source, cause) {
    if (!__privateGet(this, _client5).authenticated) {
      throw new UnauthenticatedError('Cannot send death links before connecting and authenticating.');
    }
    if (!this.enabled) {
      return;
    }
    __privateSet(this, _lastDeath, Math.ceil(Date.now() / 1e3));
    const deathLink = {
      source,
      cause,
      time: __privateGet(this, _lastDeath),
    };
    __privateGet(this, _client5).bounce({tags: ['DeathLink']}, deathLink);
  }
};
_client5 = new WeakMap();
_lastDeath = new WeakMap();

// src/classes/Hint.ts
var _client6, _hint, _item2;
var Hint = class {
  /**
   * Instantiates a new ItemMetadata.
   * @internal
   * @param client The Archipelago client associated with this manager.
   * @param hint The network hint object.
   */
  constructor(client, hint) {
    __privateAdd(this, _client6);
    __privateAdd(this, _hint);
    __privateAdd(this, _item2);
    __privateSet(this, _client6, client);
    __privateSet(this, _hint, hint);
    __privateSet(
      this,
      _item2,
      new Item(
        __privateGet(this, _client6),
        {item: hint.item, location: hint.location, player: hint.finding_player, flags: hint.item_flags},
        __privateGet(this, _client6).players.findPlayer(hint.finding_player),
        __privateGet(this, _client6).players.findPlayer(hint.receiving_player)
      )
    );
  }
  /** Returns the item contained in this hint. */
  get item() {
    return __privateGet(this, _item2);
  }
  /** Returns `true` if this item has been found. */
  get found() {
    return __privateGet(this, _hint).found;
  }
  /** Returns the entrance this location is at if entrance data is available, otherwise `"Vanilla"`. */
  get entrance() {
    return __privateGet(this, _hint).entrance || 'Vanilla';
  }
};
_client6 = new WeakMap();
_hint = new WeakMap();
_item2 = new WeakMap();

// src/classes/managers/ItemsManager.ts
var _client7, _received, _hints, _ItemsManager_instances, receivedHint_fn;
var ItemsManager = class extends EventBasedManager {
  /**
   * Instantiates a new ItemsManager.
   * @internal
   * @param client The Archipelago client associated with this manager.
   */
  constructor(client) {
    super();
    __privateAdd(this, _ItemsManager_instances);
    __privateAdd(this, _client7);
    __privateAdd(this, _received, []);
    __privateAdd(this, _hints, []);
    __privateSet(this, _client7, client);
    __privateGet(this, _client7)
      .socket.on('receivedItems', (packet) => {
        let index = packet.index;
        const count = packet.items.length;
        const items = [...packet.items];
        while (items.length > 0) {
          const networkItem = items.shift();
          __privateGet(this, _received)[index++] = new Item(
            __privateGet(this, _client7),
            networkItem,
            __privateGet(this, _client7).players.findPlayer(networkItem.player),
            __privateGet(this, _client7).players.self
          );
        }
        this.emit('itemsReceived', [
          __privateGet(this, _received).slice(packet.index, packet.index + count),
          packet.index,
        ]);
      })
      .on('connected', () => {
        __privateSet(this, _hints, []);
        __privateSet(this, _received, []);
        __privateGet(this, _client7)
          .storage.notify(
            [
              `_read_hints_${__privateGet(this, _client7).players.self.team}_${
                __privateGet(this, _client7).players.self.slot
              }`,
            ],
            __privateMethod(this, _ItemsManager_instances, receivedHint_fn).bind(this)
          )
          .then((data) => {
            const hints =
              data[
                `_read_hints_${__privateGet(this, _client7).players.self.team}_${
                  __privateGet(this, _client7).players.self.slot
                }`
              ];
            __privateSet(
              this,
              _hints,
              hints.map((hint) => new Hint(__privateGet(this, _client7), hint))
            );
            this.emit('hintsInitialized', [__privateGet(this, _hints)]);
          })
          .catch((error) => {
            throw error;
          });
      });
  }
  /** Returns a copy of all items ever received. */
  get received() {
    return [...__privateGet(this, _received)];
  }
  /**
   * Returns a copy of all hints for this player.
   * @remarks Hints may take a moment to populate after establishing connection to server, as it needs to wait for
   * data storage to fetch all current hints. If you need hints right after connecting, listen for the
   * {@link ItemEvents.hintsInitialized} event.
   */
  get hints() {
    return [...__privateGet(this, _hints)];
  }
  /** Return the number of items received. */
  get count() {
    return __privateGet(this, _received).length;
  }
};
_client7 = new WeakMap();
_received = new WeakMap();
_hints = new WeakMap();
_ItemsManager_instances = new WeakSet();
receivedHint_fn = function (_, hints) {
  for (let i = 0; i < hints.length; i++) {
    if (__privateGet(this, _hints)[i] === void 0) {
      __privateGet(this, _hints)[i] = new Hint(__privateGet(this, _client7), hints[i]);
      this.emit('hintReceived', [__privateGet(this, _hints)[i]]);
    } else if (__privateGet(this, _hints)[i].found !== hints[i].found) {
      __privateGet(this, _hints)[i] = new Hint(__privateGet(this, _client7), hints[i]);
      this.emit('hintFound', [__privateGet(this, _hints)[i]]);
    }
  }
};

// src/classes/MessageNode.ts
var BaseMessageNode = class {
  /**
   * Instantiates a new message node object.
   * @internal
   * @param client The client object containing additional context metadata for this node.
   * @param part The underlying message part component from the network protocol.
   * @protected
   */
  constructor(client, part) {
    this.client = client;
    this.part = part;
  }
  /** Returns the plaintext component of this message node. */
  toString() {
    return this.text;
  }
};
var ItemMessageNode = class extends BaseMessageNode {
  /**
   * Instantiates a new message node object.
   * @internal
   * @param client The client object containing additional context metadata for this node.
   * @param part The underlying message part component from the network protocol.
   * @param item The network item in reference to this message node.
   * @param receiver The player to receive this item.
   */
  constructor(client, part, item, receiver) {
    super(client, part);
    this.type = 'item';
    const player = client.players.findPlayer(part.player, receiver.team);
    this.part = part;
    this.item = new Item(client, item, player, receiver);
  }
  /** Returns the name of this item. */
  get text() {
    return this.item.name;
  }
};
var _name;
var LocationMessageNode = class extends BaseMessageNode {
  /**
   * Instantiates a new message node object.
   * @internal
   * @param client The client object containing additional context metadata for this node.
   * @param part The underlying message part component from the network protocol.
   */
  constructor(client, part) {
    super(client, part);
    __privateAdd(this, _name);
    this.type = 'location';
    const player = client.players.findPlayer(part.player);
    const pkg = client.package.findPackage(player.game);
    this.part = part;
    if (part.type === 'location_name') {
      __privateSet(this, _name, part.text);
      this.id = pkg.locationTable[part.text];
    } else {
      this.id = parseInt(part.text);
      __privateSet(this, _name, client.package.lookupLocationName(player.game, this.id, true));
    }
  }
  /** Returns the name of this location. */
  get text() {
    return __privateGet(this, _name);
  }
};
_name = new WeakMap();
var ColorMessageNode = class extends BaseMessageNode {
  /**
   * Instantiates a new message node object.
   * @internal
   * @param client The client object containing additional context metadata for this node.
   * @param part The underlying message part component from the network protocol.
   */
  constructor(client, part) {
    super(client, part);
    this.type = 'color';
    this.part = part;
    this.color = part.color;
  }
  get text() {
    return this.part.text;
  }
};
var TextualMessageNode = class extends BaseMessageNode {
  /**
   * Instantiates a new message node object.
   * @internal
   * @param client The client object containing additional context metadata for this node.
   * @param part The underlying message part component from the network protocol.
   */
  constructor(client, part) {
    super(client, part);
    this.part = part;
    if (this.part.type === 'entrance_name') {
      this.type = 'entrance';
    } else {
      this.type = 'text';
    }
  }
  get text() {
    return this.part.text;
  }
};
var PlayerMessageNode = class extends BaseMessageNode {
  /**
   * Instantiates a new message node object.
   * @internal
   * @param client The client object containing additional context metadata for this node.
   * @param part The underlying message part component from the network protocol.
   */
  constructor(client, part) {
    super(client, part);
    this.type = 'player';
    this.part = part;
    if (part.type === 'player_id') {
      this.player = client.players.findPlayer(parseInt(part.text));
    } else {
      const player = client.players.teams[client.players.self.team].find((p) => p.name === part.text);
      if (!player) {
        throw new Error(`Cannot find player under name: ${part.text}`);
      }
      this.player = player;
    }
  }
  /** The current alias of this player. */
  get text() {
    return this.player.alias;
  }
};

// src/classes/managers/MessageManager.ts
var _client8, _messages, _MessageManager_instances, onPrintJSON_fn;
var MessageManager = class extends EventBasedManager {
  /**
   * Instantiates a new MessageManager. Should only be instantiated by creating a new {@link Client}.
   * @internal
   * @param client The client object this manager is associated with.
   */
  constructor(client) {
    super();
    __privateAdd(this, _MessageManager_instances);
    __privateAdd(this, _client8);
    __privateAdd(this, _messages, []);
    __privateSet(this, _client8, client);
    __privateGet(this, _client8).socket.on(
      'printJSON',
      __privateMethod(this, _MessageManager_instances, onPrintJSON_fn).bind(this)
    );
  }
  /**
   * Returns a shallow copy of all logged chat messages.
   *
   * If the messages length is greater than {@link ClientOptions.maximumMessages}, the oldest messages are spliced
   * out.
   */
  get log() {
    return [...__privateGet(this, _messages)];
  }
  /**
   * Sends a chat message to the server.
   * @param text The textual message to broadcast to all connected clients.
   * @returns A promise that resolves when the server has broadcast the chat message.
   * @throws {@link UnauthenticatedError} if attempting to send a chat message when not connected or authenticated.
   */
  async say(text) {
    if (!__privateGet(this, _client8).authenticated) {
      throw new UnauthenticatedError('Cannot send chat messages without being authenticated.');
    }
    text = text.trim();
    const request = {cmd: 'Say', text};
    __privateGet(this, _client8).socket.send(request);
    await this.wait('chat', (message) => message === text);
  }
};
_client8 = new WeakMap();
_messages = new WeakMap();
_MessageManager_instances = new WeakSet();
onPrintJSON_fn = function (packet) {
  const nodes = [];
  for (const part of packet.data) {
    switch (part.type) {
      case 'item_id':
      case 'item_name': {
        const itemPacket = packet;
        let receiver;
        if (itemPacket.type === 'ItemCheat') {
          receiver = __privateGet(this, _client8).players.findPlayer(itemPacket.receiving, itemPacket.team);
        } else {
          receiver = __privateGet(this, _client8).players.findPlayer(itemPacket.receiving);
        }
        nodes.push(new ItemMessageNode(__privateGet(this, _client8), part, itemPacket.item, receiver));
        break;
      }
      case 'location_id':
      case 'location_name': {
        nodes.push(new LocationMessageNode(__privateGet(this, _client8), part));
        break;
      }
      case 'color': {
        nodes.push(new ColorMessageNode(__privateGet(this, _client8), part));
        break;
      }
      case 'player_id':
      case 'player_name': {
        nodes.push(new PlayerMessageNode(__privateGet(this, _client8), part));
        break;
      }
      default: {
        nodes.push(new TextualMessageNode(__privateGet(this, _client8), part));
        break;
      }
    }
  }
  const text = nodes.map((node) => node.text).join();
  if (__privateGet(this, _client8).options.maximumMessages >= 1) {
    this.log.push({text, nodes});
    this.log.splice(0, this.log.length - __privateGet(this, _client8).options.maximumMessages);
  }
  switch (packet.type) {
    case 'ItemSend': {
      const sender = __privateGet(this, _client8).players.findPlayer(packet.item.player);
      const receiver = __privateGet(this, _client8).players.findPlayer(packet.receiving);
      const item = new Item(__privateGet(this, _client8), packet.item, sender, receiver);
      this.emit('itemSent', [text, item, nodes]);
      break;
    }
    case 'ItemCheat': {
      const sender = __privateGet(this, _client8).players.findPlayer(packet.item.player, packet.team);
      const receiver = __privateGet(this, _client8).players.findPlayer(packet.receiving, packet.team);
      const item = new Item(__privateGet(this, _client8), packet.item, sender, receiver);
      this.emit('itemCheated', [text, item, nodes]);
      break;
    }
    case 'Hint': {
      const sender = __privateGet(this, _client8).players.findPlayer(packet.item.player);
      const receiver = __privateGet(this, _client8).players.findPlayer(packet.receiving);
      const item = new Item(__privateGet(this, _client8), packet.item, sender, receiver);
      this.emit('itemHinted', [text, item, packet.found, nodes]);
      break;
    }
    case 'Join': {
      const player = __privateGet(this, _client8).players.findPlayer(packet.slot, packet.team);
      this.emit('connected', [text, player, packet.tags, nodes]);
      break;
    }
    case 'Part': {
      const player = __privateGet(this, _client8).players.findPlayer(packet.slot, packet.team);
      this.emit('disconnected', [text, player, nodes]);
      break;
    }
    case 'Chat': {
      const player = __privateGet(this, _client8).players.findPlayer(packet.slot, packet.team);
      this.emit('chat', [packet.message, player, nodes]);
      break;
    }
    case 'ServerChat': {
      this.emit('serverChat', [packet.message, nodes]);
      break;
    }
    case 'TagsChanged': {
      const player = __privateGet(this, _client8).players.findPlayer(packet.slot, packet.team);
      this.emit('tagsUpdated', [text, player, packet.tags, nodes]);
      break;
    }
    case 'Tutorial': {
      this.emit('tutorial', [text, nodes]);
      break;
    }
    case 'CommandResult': {
      this.emit('userCommand', [text, nodes]);
      break;
    }
    case 'AdminCommandResult': {
      this.emit('adminCommand', [text, nodes]);
      break;
    }
    case 'Goal': {
      const player = __privateGet(this, _client8).players.findPlayer(packet.slot, packet.team);
      this.emit('goaled', [text, player, nodes]);
      break;
    }
    case 'Release': {
      const player = __privateGet(this, _client8).players.findPlayer(packet.slot, packet.team);
      this.emit('released', [text, player, nodes]);
      break;
    }
    case 'Collect': {
      const player = __privateGet(this, _client8).players.findPlayer(packet.slot, packet.team);
      this.emit('collected', [text, player, nodes]);
      break;
    }
    case 'Countdown': {
      this.emit('countdown', [text, packet.countdown, nodes]);
    }
  }
  this.emit('message', [text, nodes]);
};

// src/classes/Player.ts
var _client9, _player, _Player_instances, networkSlot_get;
var Player = class {
  /**
   * Instantiates a new PlayerMetadata.
   * @internal
   * @param client The Archipelago client associated with this manager.
   * @param player The network player data from the network protocol.
   */
  constructor(client, player) {
    __privateAdd(this, _Player_instances);
    __privateAdd(this, _client9);
    __privateAdd(this, _player);
    __privateSet(this, _client9, client);
    __privateSet(this, _player, player);
  }
  /** Returns the alias for this player. */
  toString() {
    return this.alias;
  }
  /** Returns the slot name for this player slot. */
  get name() {
    return __privateGet(this, _player).name;
  }
  /** Returns the current nickname for this player or the slot name if not set. */
  get alias() {
    return __privateGet(this, _player).alias;
  }
  /** Returns the game this slot is playing. */
  get game() {
    if (this.slot === 0) {
      return 'Archipelago';
    }
    return __privateGet(this, _Player_instances, networkSlot_get).game;
  }
  /** Returns the type of slot this player is. See {@link slotTypes} for more information. */
  get type() {
    if (this.slot === 0) {
      return slotTypes.spectator;
    }
    return __privateGet(this, _Player_instances, networkSlot_get).type;
  }
  /** Returns the team id this player is a member of. */
  get team() {
    return __privateGet(this, _player).team;
  }
  /** Returns this slot's id. */
  get slot() {
    return __privateGet(this, _player).slot;
  }
  /** Returns all group members of this player, if player is a group. Otherwise, returns an empty array. */
  get members() {
    if (this.type !== slotTypes.group) {
      return [];
    }
    return __privateGet(this, _client9).players.teams[this.team].filter((player) =>
      __privateGet(this, _Player_instances, networkSlot_get).group_members.includes(player.slot)
    );
  }
  /** Returns all the groups this player is a member of. */
  get groups() {
    if (this.slot === 0) {
      return [];
    }
    return __privateGet(this, _client9).players.teams[this.team].filter(
      (player) =>
        player.slot !== 0 &&
        __privateGet(this, _client9).players.slots[player.slot].group_members.includes(this.slot)
    );
  }
  /** Returns this slot's current status. See {@link clientStatuses} for more information. */
  async fetchStatus() {
    var _a;
    if (this.type === slotTypes.group) {
      return clientStatuses.goal;
    }
    return (_a = await __privateGet(this, _client9).storage.fetch(
      `_read_client_status_${this.team}_${this.slot}`
    )) != null
      ? _a
      : 0;
  }
  /**
   * Fetch this player's slot data over the network.
   * @template SlotData The type of the slot data that is returned, for better typing information.
   * @remarks This data is not tracked after running, so slot data should be cached to reduce additional network
   * calls, if necessary.
   */
  async fetchSlotData() {
    return await __privateGet(this, _client9).storage.fetch(`_read_slot_data_${this.slot}`);
  }
  /** Fetch this player's current hints. */
  async fetchHints() {
    const hints = await __privateGet(this, _client9).storage.fetch(`_read_hints_${this.team}_${this.slot}`);
    return hints.map((hint) => new Hint(__privateGet(this, _client9), hint));
  }
};
_client9 = new WeakMap();
_player = new WeakMap();
_Player_instances = new WeakSet();
networkSlot_get = function () {
  return __privateGet(this, _client9).players.slots[this.slot];
};

// src/classes/managers/PlayersManager.ts
var _client10, _players, _slots, _slot, _team;
var PlayersManager = class extends EventBasedManager {
  /**
   * Instantiates a new PlayersManager.
   * @internal
   * @param client The Archipelago client associated with this manager.
   */
  constructor(client) {
    super();
    __privateAdd(this, _client10);
    __privateAdd(this, _players, []);
    __privateAdd(this, _slots, {});
    __privateAdd(this, _slot, 0);
    __privateAdd(this, _team, 0);
    __privateSet(this, _client10, client);
    __privateGet(this, _client10)
      .socket.on('connected', (packet) => {
        var _a, _b, _c;
        __privateSet(this, _slots, Object.freeze(packet.slot_info));
        __privateSet(this, _players, []);
        __privateSet(this, _slot, packet.slot);
        __privateSet(this, _team, packet.team);
        for (const player of packet.players) {
          (_c = (_a = __privateGet(this, _players))[(_b = player.team)]) != null
            ? _c
            : (_a[_b] = [{team: player.team, slot: 0, name: 'Archipelago', alias: 'Archipelago'}]);
          __privateGet(this, _players)[player.team][player.slot] = player;
        }
      })
      .on('roomUpdate', (packet) => {
        if (!packet.players) {
          return;
        }
        for (const player of packet.players) {
          if (__privateGet(this, _players)[player.team][player.slot].alias !== player.alias) {
            const oldAlias = __privateGet(this, _players)[player.team][player.slot].alias;
            __privateGet(this, _players)[player.team][player.slot] = player;
            this.emit('aliasUpdated', [
              new Player(__privateGet(this, _client10), player),
              oldAlias,
              player.alias,
            ]);
          }
        }
      });
  }
  /**
   * Returns the {@link Player} for this client's player.
   * @throws {@link Error} if attempting to lookup {@link Player} object before connecting to the server.
   */
  get self() {
    if (__privateGet(this, _slot) === 0) {
      throw new Error('Cannot lookup own player object when client has never connected to a server.');
    }
    return new Player(
      __privateGet(this, _client10),
      __privateGet(this, _players)[__privateGet(this, _team)][__privateGet(this, _slot)]
    );
  }
  /**
   * Returns a record of basic information for each slot.
   * @remarks Slot information is shared across each team. For accessing player data, see {@link PlayersManager}.
   */
  get slots() {
    return __privateGet(this, _slots);
  }
  /**
   * Returns a 2D array of player metadata ranked by team number, then slot number.
   * @remarks Take care when accessing data for 0th slot on a team (such as when iterating over all team members), as
   * slot 0 does not technically exist in the server's multi-data, and is only relevant in-case a server sends cheated
   * items.
   * @example <caption>Print All Player Aliases to Console</caption>
   * for (const team of client.players.teams) {
   *     for (const player of team) {
   *         console.log(player.alias);
   *     }
   * }
   */
  get teams() {
    const players = [];
    for (let team = 0; team < __privateGet(this, _players).length; team++) {
      players[team] = [];
      for (let player = 0; player < __privateGet(this, _players)[team].length; player++) {
        players[team].push(
          new Player(__privateGet(this, _client10), __privateGet(this, _players)[team][player])
        );
      }
    }
    return players;
  }
  /**
   * Attempt to find a player by their team or slot name.
   * @param slot The slot id associated with the searched player.
   * @param team The team id associated with the searched player. If omitted, defaults to the team of the client
   * player.
   * @returns The player's metadata or `undefined` if not found.
   */
  findPlayer(slot, team) {
    if (team === void 0) {
      team = __privateGet(this, _client10).players.self.team;
    }
    const playerTeam = __privateGet(this, _players)[team];
    if (playerTeam) {
      return new Player(__privateGet(this, _client10), __privateGet(this, _players)[team][slot]);
    }
    return void 0;
  }
};
_client10 = new WeakMap();
_players = new WeakMap();
_slots = new WeakMap();
_slot = new WeakMap();
_team = new WeakMap();

// src/classes/managers/RoomStateManager.ts
var _client11,
  _serverVersion,
  _generatorVersion,
  _games2,
  _tags,
  _seed,
  _password,
  _hintPoints,
  _hintCost,
  _locationCheckPoints,
  _permissions,
  _missingLocations,
  _checkedLocations,
  _race;
var RoomStateManager = class extends EventBasedManager {
  /**
   * Instantiates a new RoomStateManager. Should only be instantiated by creating a new {@link Client}.
   * @internal
   * @param client The client object this manager is associated with.
   */
  constructor(client) {
    super();
    __privateAdd(this, _client11);
    __privateAdd(this, _serverVersion, {major: -1, minor: -1, build: -1});
    __privateAdd(this, _generatorVersion, {major: -1, minor: -1, build: -1});
    __privateAdd(this, _games2, []);
    __privateAdd(this, _tags, []);
    __privateAdd(this, _seed, '');
    __privateAdd(this, _password, false);
    __privateAdd(this, _hintPoints, 0);
    __privateAdd(this, _hintCost, 0);
    __privateAdd(this, _locationCheckPoints, 0);
    __privateAdd(this, _permissions, {release: 0, collect: 0, remaining: 0});
    __privateAdd(this, _missingLocations, []);
    __privateAdd(this, _checkedLocations, []);
    __privateAdd(this, _race, false);
    __privateSet(this, _client11, client);
    __privateGet(this, _client11)
      .socket.on('roomInfo', (packet) => {
        __privateSet(this, _serverVersion, {
          major: packet.version.major,
          minor: packet.version.minor,
          build: packet.version.build,
        });
        __privateSet(this, _generatorVersion, {
          major: packet.generator_version.major,
          minor: packet.generator_version.minor,
          build: packet.generator_version.build,
        });
        __privateSet(this, _tags, packet.tags);
        __privateSet(this, _games2, packet.games);
        __privateSet(this, _seed, packet.seed_name);
        __privateSet(this, _password, packet.password);
        __privateSet(this, _permissions, packet.permissions);
        __privateSet(this, _hintCost, packet.hint_cost);
        __privateSet(this, _locationCheckPoints, packet.location_check_points);
      })
      .on('connected', (packet) => {
        __privateSet(this, _missingLocations, packet.missing_locations);
        __privateSet(this, _checkedLocations, packet.checked_locations);
        this.emit('locationsChecked', [this.checkedLocations]);
        __privateSet(this, _hintPoints, packet.hint_points);
        this.emit('hintPointsUpdated', [0, packet.hint_points]);
      })
      .on('roomUpdate', (packet) => {
        if (packet.hint_cost !== void 0) {
          const [oc, op] = [this.hintCost, this.hintCostPercentage];
          __privateSet(this, _hintCost, packet.hint_cost);
          this.emit('hintCostUpdated', [oc, this.hintCost, op, this.hintCostPercentage]);
        }
        if (packet.hint_points !== void 0) {
          const old = __privateGet(this, _hintPoints);
          __privateSet(this, _hintPoints, packet.hint_points);
          this.emit('hintPointsUpdated', [old, this.hintPoints]);
        }
        if (packet.location_check_points !== void 0) {
          const old = __privateGet(this, _locationCheckPoints);
          __privateSet(this, _locationCheckPoints, packet.location_check_points);
          this.emit('locationCheckPointsUpdated', [old, this.locationCheckPoints]);
        }
        if (packet.password !== void 0) {
          __privateSet(this, _password, packet.password);
          this.emit('passwordUpdated', [this.password]);
        }
        if (packet.permissions !== void 0) {
          const old = __privateGet(this, _permissions);
          __privateSet(this, _permissions, packet.permissions);
          this.emit('permissionsUpdated', [old, this.permissions]);
        }
        if (packet.checked_locations !== void 0) {
          __privateSet(this, _checkedLocations, [
            ...__privateGet(this, _checkedLocations),
            ...packet.checked_locations,
          ]);
          __privateSet(
            this,
            _missingLocations,
            this.missingLocations.filter((location) => {
              var _a;
              return !((_a = packet.checked_locations) == null ? void 0 : _a.includes(location));
            })
          );
          this.emit('locationsChecked', [packet.checked_locations]);
        }
      });
  }
  /**
   * Returns the version of Archipelago the server is currently running.
   * @remarks All properties will be `-1` prior to initial connection.
   */
  get serverVersion() {
    return {...__privateGet(this, _serverVersion)};
  }
  /**
   * Returns the version of Archipelago the seed was generated from.
   * @remarks All properties will be `-1` prior to initial connection.
   */
  get generatorVersion() {
    return {...__privateGet(this, _generatorVersion)};
  }
  /** Returns the list of games present in the current room. */
  get games() {
    return [...__privateGet(this, _games2)];
  }
  /** Returns a list of tags the server is currently capable of. */
  get tags() {
    return [...__privateGet(this, _tags)];
  }
  /**
   * Get the seed name for this room.
   * @remarks In non-race seeds, this is based on the seed to generate this multi-world, but not exactly the same to
   * prevent reverse engineering. In race seeds, this is completely random.
   */
  get seedName() {
    return __privateGet(this, _seed);
  }
  /** Returns `true` if the room requires a password to join. */
  get password() {
    return __privateGet(this, _password);
  }
  // TODO Write these when tracking of data storage is set up (to watch client status)
  // public get canRelease(): boolean { }
  // public get canCollect(): boolean { }
  // public get canRemaining(): boolean { }
  /** Returns the current room's command permission bitflags. */
  get permissions() {
    return {...__privateGet(this, _permissions)};
  }
  /** Returns the amount of hint points this player currently has. */
  get hintPoints() {
    return __privateGet(this, _hintPoints);
  }
  /** Returns the amount of hint points this player needs to request a hint. */
  get hintCost() {
    if (this.hintCostPercentage > 0) {
      return Math.max(1, Math.floor(this.hintCostPercentage * this.allLocations.length * 0.01));
    }
    return 0;
  }
  /** Returns the percentage of locations that need to be checked to have enough points to hint from the server. */
  get hintCostPercentage() {
    return __privateGet(this, _hintCost);
  }
  /** Returns the amount of hint points received per location checked. */
  get locationCheckPoints() {
    return __privateGet(this, _locationCheckPoints);
  }
  /** Returns a list of location ids that have not been checked. */
  get missingLocations() {
    return [...__privateGet(this, _missingLocations)].sort();
  }
  /** Returns a list of location ids that have been checked. */
  get checkedLocations() {
    return [...__privateGet(this, _checkedLocations)].sort();
  }
  /** Returns a list of all location ids for this slot. */
  get allLocations() {
    return [...__privateGet(this, _missingLocations), ...__privateGet(this, _checkedLocations)].sort();
  }
  /**
   * Returns if this seed was generated with race mode enabled (to be used to obscure unnecessary details to make
   * clients race legal depending on rules).
   * @experimental
   */
  get race() {
    return __privateGet(this, _race);
  }
};
_client11 = new WeakMap();
_serverVersion = new WeakMap();
_generatorVersion = new WeakMap();
_games2 = new WeakMap();
_tags = new WeakMap();
_seed = new WeakMap();
_password = new WeakMap();
_hintPoints = new WeakMap();
_hintCost = new WeakMap();
_locationCheckPoints = new WeakMap();
_permissions = new WeakMap();
_missingLocations = new WeakMap();
_checkedLocations = new WeakMap();
_race = new WeakMap();

// src/classes/managers/SocketManager.ts
var _socket, _connected, _SocketManager_instances, parseMessage_fn, findWebSocket_fn;
var SocketManager = class extends EventBasedManager {
  /**
   * Instantiates a new SocketManager. Should only be instantiated by creating a new {@link Client}.
   * @internal
   */
  constructor() {
    super();
    __privateAdd(this, _SocketManager_instances);
    __privateAdd(this, _socket, null);
    __privateAdd(this, _connected, false);
  }
  /** Returns `true` if currently connected to a websocket server. */
  get connected() {
    return __privateGet(this, _connected);
  }
  /** Returns the current connection's URL or an empty string, if not connected. */
  get url() {
    var _a, _b;
    return (_b = (_a = __privateGet(this, _socket)) == null ? void 0 : _a.url) != null ? _b : '';
  }
  /**
   * Send a list of raw client packets to the server.
   * @param packets List of client packets to send.
   * @returns This SocketManager.
   * @throws {@link SocketError} if not connected to a server.
   */
  send(...packets) {
    if (__privateGet(this, _socket)) {
      __privateGet(this, _socket).send(JSON.stringify(packets));
      this.emit('sentPackets', [packets]);
      return this;
    }
    throw new SocketError('Unable to send packets to the server; not connected to a server.');
  }
  /**
   * Establish a connection to an Archipelago server before authenticating; useful if there might be tasked that are
   * needed to be performed before authenticating, but after connecting (e.g., DataPackage).
   * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
   * @returns The {@link RoomInfoPacket} received on initial connection.
   * @throws {@link SocketError} if failed to connect or no websocket API is available.
   * @throws {@link TypeError} if provided URL is malformed or invalid protocol.
   * @remarks If the port is omitted, client will default to `38281`.
   *
   * If the protocol is omitted, client will attempt to connect via `wss`, then fallback to `ws` if unsuccessful.
   */
  async connect(url) {
    this.disconnect();
    if (typeof url === 'string') {
      const pattern = /^([a-zA-Z]+:)\/\/[A-Za-z0-9_.~\-:]+/i;
      if (!pattern.test(url)) {
        try {
          return await this.connect(new URL(`wss://${url}`));
        } catch {
          return await this.connect(new URL(`ws://${url}`));
        }
      }
      url = new URL(url);
    }
    url.port = url.port || '38281';
    if (url.protocol !== 'wss:' && url.protocol !== 'ws:') {
      throw new TypeError('Unexpected protocol. Archipelago only supports the ws:// and wss:// protocols.');
    }
    try {
      return new Promise((resolve, reject) => {
        const IsomorphousWebSocket = __privateMethod(this, _SocketManager_instances, findWebSocket_fn).call(
          this
        );
        if (IsomorphousWebSocket === null) {
          throw new SocketError('Unable to find a suitable WebSocket API in the current runtime.');
        }
        __privateSet(this, _socket, new IsomorphousWebSocket(url));
        __privateGet(this, _socket).onmessage = __privateMethod(
          this,
          _SocketManager_instances,
          parseMessage_fn
        ).bind(this);
        __privateGet(this, _socket).onclose = () => {
          this.disconnect();
          reject(new SocketError('Failed to connect to Archipelago server.'));
        };
        __privateGet(this, _socket).onerror = () => {
          this.disconnect();
          reject(new SocketError('Failed to connect to Archipelago server.'));
        };
        __privateGet(this, _socket).onopen = () => {
          this.wait('roomInfo')
            .then(([packet]) => {
              __privateSet(this, _connected, true);
              if (__privateGet(this, _socket)) {
                __privateGet(this, _socket).onclose = this.disconnect.bind(this);
                __privateGet(this, _socket).onerror = this.disconnect.bind(this);
                resolve(packet);
                return;
              }
              this.disconnect();
              reject(new SocketError('Failed to connect to Archipelago server.'));
            })
            .catch((error) => {
              throw error;
            });
        };
      });
    } catch (error) {
      this.disconnect();
      throw error;
    }
  }
  /**
   * Disconnect from the current Archipelago server, if still connected.
   */
  disconnect() {
    var _a;
    if (!this.connected) {
      return;
    }
    __privateSet(this, _connected, false);
    (_a = __privateGet(this, _socket)) == null ? void 0 : _a.close();
    __privateSet(this, _socket, null);
    this.emit('disconnected', []);
  }
};
_socket = new WeakMap();
_connected = new WeakMap();
_SocketManager_instances = new WeakSet();
parseMessage_fn = function (event) {
  const packets = JSON.parse(event.data);
  for (const packet of packets) {
    switch (packet.cmd) {
      case 'ConnectionRefused':
        this.emit('connectionRefused', [packet]);
        break;
      case 'Bounced':
        this.emit('bounced', [packet, packet.data]);
        break;
      case 'Connected':
        this.emit('connected', [packet]);
        break;
      case 'DataPackage':
        this.emit('dataPackage', [packet]);
        break;
      case 'InvalidPacket':
        this.emit('invalidPacket', [packet]);
        break;
      case 'LocationInfo':
        this.emit('locationInfo', [packet]);
        break;
      case 'PrintJSON':
        this.emit('printJSON', [packet]);
        break;
      case 'ReceivedItems':
        this.emit('receivedItems', [packet]);
        break;
      case 'Retrieved':
        this.emit('retrieved', [packet]);
        break;
      case 'RoomInfo':
        this.emit('roomInfo', [packet]);
        break;
      case 'RoomUpdate':
        this.emit('roomUpdate', [packet]);
        break;
      case 'SetReply':
        this.emit('setReply', [packet]);
        break;
    }
    this.emit('receivedPacket', [packet]);
  }
};
findWebSocket_fn = function () {
  let IsomorphousWebSocket = null;
  if (typeof window !== 'undefined') {
    IsomorphousWebSocket = window.WebSocket || window.MozWebSocket;
  } else if (typeof global !== 'undefined') {
    IsomorphousWebSocket = global.WebSocket || global.MozWebSocket;
  } else if (typeof self !== 'undefined') {
    IsomorphousWebSocket = self.WebSocket || self.MozWebSocket;
  } else if (typeof WebSocket !== 'undefined') {
    IsomorphousWebSocket = WebSocket;
  } else if (typeof MozWebSocket !== 'undefined') {
    IsomorphousWebSocket = MozWebSocket;
  }
  return IsomorphousWebSocket;
};

// src/classes/Client.ts
var _authenticated, _arguments, _name2, _game;
var Client = class {
  /**
   * Instantiates a new Archipelago client. After creating, call {@link Client.login} to connect and authenticate to
   * a server.
   * @param options Additional configuration options for this client. See {@link ClientOptions} for more information.
   */
  constructor(options) {
    __privateAdd(this, _authenticated, false);
    __privateAdd(this, _arguments, defaultConnectionOptions);
    __privateAdd(this, _name2, '');
    __privateAdd(this, _game, '');
    /** A helper object for handling websocket communication and AP network protocol. */
    this.socket = new SocketManager();
    /** A helper object for handling game data packages. */
    this.package = new DataPackageManager(this);
    /** A helper object for handling the data storage API. */
    this.storage = new DataStorageManager(this);
    /** A helper object for handling room state. */
    this.room = new RoomStateManager(this);
    /** A helper object for handling players (including self). */
    this.players = new PlayersManager(this);
    /** A helper object for handling received items and hints. */
    this.items = new ItemsManager(this);
    /** A helper object for handling chat messages. */
    this.messages = new MessageManager(this);
    /** A helper object for handling DeathLink mechanics. */
    this.deathLink = new DeathLinkManager(this);
    if (options) {
      this.options = {...defaultClientOptions, ...options};
    } else {
      this.options = {...defaultClientOptions};
    }
    this.socket
      .on('disconnected', () => {
        __privateSet(this, _authenticated, false);
      })
      .on('sentPackets', (packets) => {
        for (const packet of packets) {
          if (packet.cmd === 'ConnectUpdate') {
            __privateGet(this, _arguments).tags = packet.tags;
            __privateGet(this, _arguments).items = packet.items_handling;
          }
        }
      });
  }
  /** Returns `true` if currently connected and authenticated to the Archipelago server. */
  get authenticated() {
    return this.socket.connected && __privateGet(this, _authenticated);
  }
  /** Returns the client's current slot name (or an empty string, if never connected). */
  get name() {
    return __privateGet(this, _name2);
  }
  /** Returns the client's current game name (or an empty string, if never connected). */
  get game() {
    return __privateGet(this, _game);
  }
  /** Returns a copy of this client's current connection arguments (or defaults, if never connected). */
  get arguments() {
    return {...__privateGet(this, _arguments)};
  }
  /**
   * Connect and authenticate to an Archipelago server.
   * @template SlotData If slot data is requested, this sets the type of the returning slot data.
   * @param url The url of the server, including the protocol (e.g., `wss://archipelago.gg:38281`).
   * @param name The slot name this client will be connecting to.
   * @param game The game name this client will be connecting to. If omitted, client will connect in "TextOnly" mode.
   * @param options Additional optional connection arguments.
   * @throws {@link ArgumentError} if slot name is empty.
   * @throws {@link LoginError} if the server refuses the authentication attempt.
   * @throws {@link TypeError} if provided URL is malformed or invalid protocol.
   * @remarks If the port is omitted, the client will default to `38281` (AP default).
   *
   * If the protocol is omitted, client will attempt to connect via wss, then fallback to ws if unsuccessful.
   *
   * Any paths, queries, fragments, or userinfo components of the provided url will be ignored.
   * @example <caption>Password Required and No Slot Data</caption>
   * import { Client } from "archipelago.js";
   *
   * const client = new Client();
   *
   * await client.login("archipelago.gg:38281", "Phar", "Clique", {
   *     slotData: false,
   *     password: "4444"
   * });
   * @example <caption>TypeScript with Slot Data</caption>
   * import { Client } from "archipelago.js";
   *
   * type CliqueSlotData = {
   *     color: string
   *     hard_mode: boolean
   * }
   *
   * const client = new Client();
   *
   * // slotData: CliqueSlotData { color: "red", hard_mode: false }
   * const slotData = await client.login<CliqueSlotData>("archipelago.gg:38281", "Phar", "Clique");
   */
  async login(url, name, game = '', options) {
    if (name === '') {
      throw new ArgumentError('Provided slot name cannot be blank.', 'name', name);
    }
    if (options) {
      __privateSet(this, _arguments, {...defaultConnectionOptions, ...options});
    } else {
      __privateSet(this, _arguments, {...defaultConnectionOptions});
    }
    const tags = new Set(this.arguments.tags);
    if (!game && !tags.has('HintGame') && !tags.has('Tracker') && !tags.has('TextOnly')) {
      tags.add('TextOnly');
    }
    __privateGet(this, _arguments).tags = Array.from(tags);
    const request = {
      cmd: 'Connect',
      name,
      game,
      password: this.arguments.password,
      slot_data: this.arguments.slotData,
      items_handling: this.arguments.items,
      uuid: this.arguments.uuid,
      tags: this.arguments.tags,
      version: {...this.arguments.version, class: 'Version'},
    };
    await this.socket.connect(url);
    if (this.options.autoFetchDataPackage) {
      await this.package.fetchPackage();
    }
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new SocketError('Server failed to respond in time.')),
        this.options.timeout
      );
      const connectedHandler = (packet) => {
        __privateSet(this, _authenticated, true);
        __privateSet(this, _game, packet.slot_info[packet.slot].game);
        __privateSet(this, _name2, packet.slot_info[packet.slot].name);
        this.socket.off('connected', connectedHandler).off('connectionRefused', refusedHandler);
        clearTimeout(timeout);
        resolve(packet.slot_data);
      };
      const refusedHandler = (packet) => {
        var _a, _b;
        this.socket.off('connected', connectedHandler).off('connectionRefused', refusedHandler);
        clearTimeout(timeout);
        reject(
          new LoginError(
            `Connection was refused by the server. Reason(s): [${
              (_a = packet.errors) == null ? void 0 : _a.join(', ')
            }`,
            (_b = packet.errors) != null ? _b : []
          )
        );
      };
      this.socket
        .on('connected', connectedHandler.bind(this))
        .on('connectionRefused', refusedHandler.bind(this))
        .send(request);
    });
  }
  /**
   * Update the client status for the current player. For a list of known client statuses, see {@link clientStatuses}.
   * @param status The status to change to.
   * @throws {@link UnauthenticatedError} if not connected and authenticated.
   * @remarks The server will automatically set the player's status to {@link clientStatuses.disconnected} when all
   * clients connected to this slot have disconnected, set the status to {@link clientStatuses.connected} if a client
   * connects to this slot when previously set to {@link clientStatuses.disconnected}, or ignores any future updates
   * if ever set to {@link clientStatuses.goal}.
   * @example
   * import { Client, clientStatuses } from "archipelago.js";
   *
   * const client = new Client();
   * await client.login("wss://archipelago.gg:38281", "Phar", "Clique");
   *
   * // Mark client as ready to start.
   * client.updateStatus(clientStatuses.ready);
   */
  updateStatus(status) {
    if (!this.authenticated) {
      throw new UnauthenticatedError('Cannot update status while not connected and authenticated.');
    }
    this.socket.send({cmd: 'StatusUpdate', status});
  }
  /**
   * A shorthand for running `Client.updateStatus(clientStatuses.goal)`. Once set, cannot be changed and if release
   * and/or collect is set to automatic, will release/collect all items.
   * @throws {@link UnauthenticatedError} if not connected and authenticated.
   */
  goal() {
    this.updateStatus(clientStatuses.goal);
  }
  /**
   * Request the server update this client's tags.
   * @param tags Tags to replace the current ones.
   * @throws {@link UnauthenticatedError} if not connected and authenticated.
   */
  updateTags(tags) {
    if (!this.authenticated) {
      throw new UnauthenticatedError('Cannot update tags while not connected and authenticated.');
    }
    this.socket.send({cmd: 'ConnectUpdate', tags, items_handling: this.arguments.items});
  }
  /**
   * Request the server update the kinds of item received events this client should receive.
   * @param items New item handling flags.
   * @throws {@link UnauthenticatedError} if not connected and authenticated.
   */
  updateItemsHandling(items) {
    if (!this.authenticated) {
      throw new UnauthenticatedError('Cannot update tags while not connected and authenticated.');
    }
    this.socket.send({cmd: 'ConnectUpdate', tags: this.arguments.tags, items_handling: items});
  }
  /**
   * Marks a list of locations as checked on the server.
   * @param locations Location ids to check.
   * @throws {@link UnauthenticatedError} if attempting to check locations while not authenticated.
   * @remarks Locations that do not exist or have already been checked in the multi-world are ignored.
   */
  check(...locations) {
    if (!this.authenticated) {
      throw new UnauthenticatedError('Cannot check locations while not connected and authenticated.');
    }
    locations = locations.filter((location) => this.room.missingLocations.includes(location));
    this.socket.send({cmd: 'LocationChecks', locations});
  }
  /**
   * Scout a list of locations for their containing items.
   * @param locations A list of location ids to scout.
   * @param createHint Whether to create hints for these locations.
   *
   * - If set to `0`, this packet will not create hints for any locations in this packet.
   * - If set to `1`, this packet will create hints for all locations in this packet and broadcast them to all
   * relevant clients.
   * - If set to `2`, this packet will create hints for all locations in this packet and broadcast only new hints to
   * all relevant clients.
   * @throws {@link UnauthenticatedError} if attempting to scout locations while not authenticated.
   */
  async scout(locations, createHint = 0) {
    if (!this.authenticated) {
      throw new UnauthenticatedError('Cannot scout locations while not connected and authenticated.');
    }
    locations = locations.filter((location) => this.room.allLocations.includes(location));
    const [response] = await this.socket
      .send({cmd: 'LocationScouts', create_as_hint: createHint, locations})
      .wait('locationInfo', (packet) => {
        return (
          packet.locations
            .map((location) => location.location)
            .toSorted()
            .join(',') === locations.toSorted().join(',')
        );
      });
    return response.locations.map(
      (item) => new Item(this, item, this.players.self, this.players.findPlayer(item.player))
    );
  }
  /**
   * Send a bounce packet targeting any clients that fulfil any target parameters. Can be listened for by listening to
   * "bounced" events on {@link SocketManager}.
   * @param targets The targets to receive this bounce packet.
   * @param targets.games Specific games that should receive this bounce.
   * @param targets.slots Specific slots that should receive this bounce.
   * @param targets.tags Specific clients with these tags that should receive this bounce.
   * @param data The json-serializable data to send.
   * @throws {@link UnauthenticatedError} if attempting to send a bounce while not authenticated.
   * @remarks If no targets are specified, no clients will receive this bounce packet.
   */
  bounce(targets, data) {
    var _a, _b, _c;
    if (!this.authenticated) {
      throw new UnauthenticatedError('Cannot send bounces while not connected and authenticated.');
    }
    this.socket.send({
      cmd: 'Bounce',
      data,
      games: (_a = targets.games) != null ? _a : [],
      slots: (_b = targets.slots) != null ? _b : [],
      tags: (_c = targets.tags) != null ? _c : [],
    });
  }
};
_authenticated = new WeakMap();
_arguments = new WeakMap();
_name2 = new WeakMap();
_game = new WeakMap();
export {
  api_exports as API,
  ArgumentError,
  BaseMessageNode,
  Client,
  ColorMessageNode,
  DataPackageManager,
  DataStorageManager,
  DeathLinkManager,
  EventBasedManager,
  Hint,
  IntermediateDataOperation,
  Item,
  ItemMessageNode,
  ItemsManager,
  LocationMessageNode,
  LoginError,
  MessageManager,
  PackageMetadata,
  Player,
  PlayerMessageNode,
  PlayersManager,
  RoomStateManager,
  SocketError,
  SocketManager,
  TextualMessageNode,
  UnauthenticatedError,
  clientStatuses,
  defaultClientOptions,
  defaultConnectionOptions,
  itemClassifications,
  itemsHandlingFlags,
  libraryVersion,
  permissions,
  slotTypes,
  targetVersion,
};
