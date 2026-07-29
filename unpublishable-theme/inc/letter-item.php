<?php
/**
 * One row in the index of letters: title, dek (the manual excerpt),
 * date. The whole row is a single click target via the stretched
 * link on the title.
 */
?>
<article <?php post_class( 'item' ); ?>>
	<h2 class="ttl"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
	<?php if ( has_excerpt() ) : ?>
	<p class="dek"><?php echo esc_html( get_the_excerpt() ); ?></p>
	<?php endif; ?>
	<div class="date"><span><?php echo esc_html( get_the_date( 'M j, Y' ) ); ?></span></div>
</article>
