import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  module HistoryRecord {
    public func compareByTimestampDesc(record1 : HistoryRecord, record2 : HistoryRecord) : Order.Order {
      Nat.compare(record2.timestamp, record1.timestamp);
    };
  };

  type FileType = {
    #photo;
    #video;
  };

  type HistoryRecord = {
    id : Text;
    filename : Text;
    fileType : FileType;
    scaleFactor : Nat;
    sharpness : Nat;
    noiseReduction : Bool;
    originalBlob : Storage.ExternalBlob;
    processedBlob : Storage.ExternalBlob;
    timestamp : Nat;
    fileSize : Nat;
  };

  let historyRecords = Map.empty<Text, HistoryRecord>();

  public shared ({ caller }) func addHistoryRecord(id : Text, filename : Text, fileType : FileType, scaleFactor : Nat, sharpness : Nat, noiseReduction : Bool, originalBlob : Storage.ExternalBlob, processedBlob : Storage.ExternalBlob, fileSize : Nat) : async () {
    if (historyRecords.containsKey(id)) { Runtime.trap("History record with this ID already exists.") };
    let timestamp = Time.now().toNat();
    let record : HistoryRecord = {
      id;
      filename;
      fileType;
      scaleFactor;
      sharpness;
      noiseReduction;
      originalBlob;
      processedBlob;
      timestamp;
      fileSize;
    };
    historyRecords.add(id, record);
  };

  public query ({ caller }) func getAllHistoryRecords() : async [HistoryRecord] {
    historyRecords.values().toArray().sort(HistoryRecord.compareByTimestampDesc);
  };

  public shared ({ caller }) func deleteHistoryRecord(id : Text) : async () {
    if (not historyRecords.containsKey(id)) { Runtime.trap("History record does not exist.") };
    historyRecords.remove(id);
  };

  public shared ({ caller }) func clearAllHistoryRecords() : async () {
    historyRecords.clear();
  };
};
