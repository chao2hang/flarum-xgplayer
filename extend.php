<?php

use Flarum\Extend;

return [
    (new Extend\Formatter)
        ->configure(function ($configurator) {
            $configurator->BBCodes->addCustom(
                '[xgplayer url={URL} poster={URL?} type={SIMPLETEXT?}][/xgplayer]',
                '<div class="xgplayer-container" data-url="{@url}">'
                . '<xsl:if test="@poster"><xsl:attribute name="data-poster"><xsl:value-of select="@poster"/></xsl:attribute></xsl:if>'
                . '<xsl:if test="@type"><xsl:attribute name="data-type"><xsl:value-of select="@type"/></xsl:attribute></xsl:if>'
                . '</div>'
            );
        }),

    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),
];
