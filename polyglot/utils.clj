;; Clojure utility - sequence helpers
(ns utils)

(defn take-while-inc [pred coll]
  (lazy-seq
    (when-let [[f & r] (seq coll)]
      (if (pred f)
        (cons f (take-while-inc pred r))
        [f]))))

(defn zip-map [ks vs]
  (zipmap ks vs))
