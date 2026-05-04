;; Scheme utility — higher-order helpers
(define (compose . fns)
  (if (null? fns)
      (lambda (x) x)
      (lambda (x) ((car fns) ((apply compose (cdr fns)) x)))))

(define (curry f . args)
  (lambda more (apply f (append args more))))
