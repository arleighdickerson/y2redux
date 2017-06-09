<?php

namespace frontend\assets;


use PHPHtmlParser\Dom;
use PHPHtmlParser\Exceptions\EmptyCollectionException;
use Yii;
use yii\base\ErrorException;
use yii\base\Exception;
use yii\caching\ExpressionDependency;
use yii\web\AssetBundle;
use yii\web\View;

/**
 * This class is responsible for registering the webpack-compiled css and js with the view.
 * It scrapes the template output by webpack for the asset urls and caches the results.
 * Cache invalidation is determined by the modification time of the html template.
 *
 * Class WebpackAsset
 * @package frontend\assets
 */
class WebpackAsset extends AssetBundle {
    /**
     * @var string the location of the template output by the webpack compiler
     */
    public static $templatePath = "@frontend/runtime/webpack/index.html";

    public $depends = [
        HeadAsset::class,
        BodyAsset::class
    ];

    /**
     * @inheritdoc
     */
    public static function register($view) {
        self::configureChildAssets();
        return parent::register($view);
    }

    /**
     * @var Dom
     */
    private static $_dom;

    /**
     * @return Dom
     */
    private static function getDom() {
        if (self::$_dom === null) {
            self::$_dom = new Dom;
            self::complainIfTemplateMissing(function () {
                self::$_dom->loadFromFile(Yii::getAlias(self::$templatePath), [
                    'removeScripts' => false
                ]);
            });
        }
        return self::$_dom;
    }

    /**
     * configures and registers child bundles with the asset manager
     * @return void
     */
    private static function configureChildAssets() {
        foreach (self::resolveUrls() as $class => $config) {
            Yii::$app->assetManager->bundles[$class] = $config;
        }
    }

    /**
     * Scrapes the css and js urls from the webpack output template
     * and caches the result for later use.
     */
    private static function resolveUrls() {
        $result = self::complainIfTemplateMissing(function () {
            return Yii::$app->cache->get(self::class);
        });
        if ($result === false) {
            $result = [
                HeadAsset::class => [
                    'css' => self::scrapeCssUrls(View::POS_HEAD),
                    'js' => self::scrapeJsUrls(View::POS_HEAD),
                ],
                BodyAsset::class => [
                    'js' => self::scrapeJsUrls(View::POS_END),
                ]
            ];
            Yii::$app->cache->set(self::class, $result, 0, new ExpressionDependency([
                'expression' => 'filemtime($this->params)',
                'params' => Yii::getAlias(self::$templatePath)
            ]));
        }
        return $result;
    }

    /**
     * @param int $pos the position constant (1 or 3)
     * @return Dom\Tag[]
     */
    private static function scrapeCssUrls($pos) {
        return self::getChildTags('link', $pos, 'href');
    }

    /**
     * @param int $pos the position constant (1 or 3)
     * @return Dom\Tag[]
     */
    private static function scrapeJsUrls($pos) {
        return self::getChildTags('script', $pos, 'src');
    }

    /**
     * @param string $tag the tag name
     * @param int $pos the position constant (1 or 3)
     * @param $attr
     * @return Dom\Tag[]
     */

    private static function getChildTags($tag, $pos, $attr) {
        return iterator_to_array(static::queryChildTags($tag, $pos, $attr));
    }

    /**
     * @param $tag
     * @param $pos
     * @param $attr
     * @return \Generator
     */
    private static function queryChildTags($tag, $pos, $attr) {
        $selector = [
            View::POS_HEAD => 'head',
            View::POS_END => 'body',
        ][$pos];
        try {
            foreach (self::getDom()->find($selector)->find($tag) as $node) {
                $attrs = $node->getAttributes();
                unset($attrs[$attr]);
                array_unshift($attrs, parse_url($node->getAttribute($attr), PHP_URL_PATH));
                yield $attrs;
            }
        } catch (EmptyCollectionException $e) {
        }
    }

    private static function complainIfTemplateMissing($cb) {
        try {
            return $cb();
        } catch (ErrorException $e) {
            throw new Exception("Url template file not found at path '"
                . self::$templatePath
                . "'. Is the node development server turned on?");
        }
    }
}

class HeadAsset extends AssetBundle {
    public $basePath = '@webroot/assets';
    public $baseUrl = '@web/assets';
    public $jsOptions = [
        'position' => View::POS_HEAD
    ];
}

class BodyAsset extends AssetBundle {
    public $basePath = '@webroot/assets';
    public $baseUrl = '@web/assets';
    public $jsOptions = [
        'position' => View::POS_END
    ];
}
