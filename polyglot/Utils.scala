// Scala utility — functional helpers
object Utils {
  def groupBy[A, K](items: List[A])(key: A => K): Map[K, List[A]] =
    items.foldLeft(Map.empty[K, List[A]]) { (acc, item) =>
      val k = key(item)
      acc + (k -> (acc.getOrElse(k, Nil) :+ item))
    }

  def zipWithIndex[A](items: List[A]): List[(A, Int)] =
    items.zipWithIndex
}
