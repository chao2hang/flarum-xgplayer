<?php

namespace Chaos\XiguaVideo;

use Flarum\Extend\ExtenderInterface;
use Illuminate\Contracts\Container\Container;

class Ext implements ExtenderInterface
{
    public function extend(Container $container, ?\Flarum\Extension\Extension $extension = null): void
    {
        // Extension bootstrapping handled via extend.php
    }
}
