;;; Common Lisp utility — list helpers
(defun flatten (lst)
  (cond ((null lst) nil)
        ((consp (car lst)) (append (flatten (car lst)) (flatten (cdr lst))))
        (t (cons (car lst) (flatten (cdr lst))))))

(defun take (n lst)
  (if (or (zerop n) (null lst))
      nil
      (cons (car lst) (take (1- n) (cdr lst)))))
