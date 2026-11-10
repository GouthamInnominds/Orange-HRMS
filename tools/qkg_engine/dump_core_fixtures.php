<?php

use OrangeHRM\Tests\Util\CoreFixtureService;
use OrangeHRM\Framework\ServiceContainer;
use OrangeHRM\Framework\Services;
use OrangeHRM\ORM\Doctrine;

define('ROOT_PATH', realpath(__DIR__ . '/../../orange_hrm'));
require ROOT_PATH . '/src/vendor/autoload.php';
require ROOT_PATH . '/lib/confs/Conf.php';

// Connect to orangehrm_mysql (production)
putenv('OHRM_DB_NAME=orangehrm_mysql');
putenv('OHRM_DB_HOST=127.0.0.1');
putenv('OHRM_DB_PORT=3306');
putenv('OHRM_DB_USER=root');
putenv('OHRM_DB_PASS=root');

ServiceContainer::getContainer()
    ->register(Services::DOCTRINE)
    ->setFactory([Doctrine::class, 'getEntityManager']);

try {
    echo "Dumping core fixtures from orangehrm_mysql...\n";
    $service = new CoreFixtureService();
    $service->saveToFixtures();
    echo "Fixtures dumped successfully. Is ready: " . ($service->isReady() ? "YES" : "NO") . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
}
